export interface ContactResourceDto {
  id: number;
  name: string;
  surname: string;
  photo: string;
  phone: string;
  email: string;
  isConnected: boolean;
  lastConnection: Date;
  chatId: string;
}
