export interface AuthResponseDto {
  user: {
    id: number;
    email: string | null;
    phone: string | null;
    name: string;
  };
  token: string;
}
