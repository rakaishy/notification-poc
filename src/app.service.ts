import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  validateSecred(request: { crc: string; hmac: string }): any {
    const tempSecret = 'testSecret';

    this.verifyHmacSignature(request.hmac, tempSecret);

    const response = this.getResponseHash(`${tempSecret}${request.crc}`);

    return new Promise((resolve) => {
      resolve({ responseHash: response });
    });
  }

  getResponseHash(toHash: string) {
    const hash = createHash('sha256');
    const response = hash.update(toHash);
    const buff = new Buffer(response.copy().digest('hex'));
    const base64data = buff.toString('base64');
    return base64data;
  }

  verifyHmacSignature(hmac: string, secret: string) {
    if (!hmac) {
      throw new HttpException('MISSING_HMAC_SIGNATURE', HttpStatus.BAD_REQUEST);
    }
    if (!secret) {
      throw new HttpException('MISSING_SECRET_VALUE', HttpStatus.BAD_REQUEST);
    }
  }

  getBodyFromPush(
    body: unknown,
    headers: {
      dataPartitionId: string;
      correlationId: string;
    },
  ) {
    console.info(`push notification arrives with body: ${body}`);
    console.info(`provided heaers for push notification: ${headers}`);

    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
