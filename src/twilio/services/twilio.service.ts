import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;
  private verifyServiceSid: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.client = twilio(accountSid, authToken);

    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
  }

  // Método para enviar SMS de verificación
  async sendVerificationCode(to: string) {
    try {
      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to: to, channel: 'sms', customCode: '4569' });

      console.log(verification);
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  }

  // Método para verificar el código ingresado por el usuario
  async checkVerificationCode(to: string, code: string) {
    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ to: to, code: code });

      return verificationCheck.status === 'approved';
    } catch (error) {
      console.error('Error checking verification code:', error);
      throw error;
    }
  }
}
