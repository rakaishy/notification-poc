import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class AppService {
  //TODO: DELETE ME
  getHello(): string {
    return 'Hello World!';
  }

  validateSecred(request: { crc: string; hmac: string }): any {
    //TODO: change to environment files to obtaine it live.
    //Note: the password must be hex and even number under characters. (not mentioned on documentation.)
    const tempSecret = '74657374666f72436464';

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

  //TODO: need to add real validation for hmac now that we have real responses.
  verifyHmacSignature(hmac: string, secret: string) {
    if (!hmac) {
      throw new HttpException('MISSING_HMAC_SIGNATURE', HttpStatus.BAD_REQUEST);
    }
    if (!secret) {
      throw new HttpException('MISSING_SECRET_VALUE', HttpStatus.BAD_REQUEST);
    }
  }

  //TODO: adjust real logic to cast results after filtering the kind.
  getBodyFromPush(
    body: unknown,
    headers: {
      dataPartitionId: string;
      correlationId: string;
    },
  ) {
    console.info(`push notification arrives with body: `);
    console.info(JSON.stringify(body));
    console.info(`provided headers for push notification: `);
    console.info(JSON.stringify(headers));

    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
