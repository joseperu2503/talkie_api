import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

@Injectable()
export class FirebaseService {
  constructor() {}

  async getAccessToken() {
    const jwtClient = new google.auth.JWT({
      keyFile: 'firebase-admin.json',
      scopes: SCOPES,
    });

    try {
      const tokens = await jwtClient.authorize();
      return tokens.access_token;
    } catch (error) {
      return null;
    }
  }
}
