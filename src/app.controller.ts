import { Headers, Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('consumer')
  public async keepAlive(
    @Query('crc') crc: string,
    @Query('hmac') hmac: string,
  ): Promise<unknown> {
    console.timeStamp(`request challenged with crc: ${crc}`);
    console.timeStamp(`request enters with hmac: ${hmac}`);
    return this.appService.validateSecred({ crc, hmac });
  }

  @Post('consumer')
  public async pushNotification(
    @Body() data,
    @Query('hmac') hmac: string,
    @Headers('data-partition-id') dataPartitionId: string,
    @Headers('correlation-id') correlationId: string,
  ) {
    this.appService.getBodyFromPush(data, {
      dataPartitionId,
      correlationId,
    });
  }
}
