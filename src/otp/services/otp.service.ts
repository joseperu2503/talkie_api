import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from 'src/redis/services/redis.service';

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRATION = 300; // 5 minutos

  constructor(private readonly redisService: RedisService) {}

  async generate(): Promise<{ id: string; value: string }> {
    const id = randomUUID();
    const value = Math.floor(1000 + Math.random() * 9000).toString();

    await this.redisService.set(`otp:${id}`, value, this.OTP_EXPIRATION);

    return { id, value };
  }

  async verify(id: string, value: string): Promise<boolean> {
    const storedOtp = await this.redisService.get(`otp:${id}`);

    if (!storedOtp) return false;
    const isValid = storedOtp === value;

    return isValid;
  }

  async delete(id: string) {
    await this.redisService.del(`otp:${id}`);
  }
}
