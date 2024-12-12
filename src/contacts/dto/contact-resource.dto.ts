export interface ContactResourceDto {
  id: number;
  name: string;
  surname: string;
  photo: string | null;
  phone: string | null;
  email: string | null;
  isConnected: boolean;
  lastConnection: Date;
  chatId: string;
}
