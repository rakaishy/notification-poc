import { Headers, Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //TODO: DELETE ME
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //Note: Creates a challenge endpoint for the subscription creation, does not get hit again after creating the notification.
  @Get('consumer')
  public async keepAlive(
    @Query('crc') crc: string,
    @Query('hmac') hmac: string,
  ): Promise<unknown> {
    console.timeStamp(`request challenged with crc: ${crc}`);
    console.timeStamp(`request enters with hmac: ${hmac}`);
    return this.appService.validateSecred({ crc, hmac });
  }

  //Note: there can be multiple partitions registered and would hit the same endpoint.
  //Note: bearer token comes joined to hmac, could be used to validate request, it does seem to have sometime issues with non public endpoints.
  @Post('consumer')
  public async pushNotification(
    @Body() data: unknown,
    @Query('hmac') hmac: string, //can be used to validate call against challenger.
    @Headers('data-partition-id') dataPartitionId: string,
    @Headers('correlation-id') correlationId: string,
  ): Promise<void> {
    this.appService.getBodyFromPush(data, {
      dataPartitionId,
      correlationId,
    });
  }
}
