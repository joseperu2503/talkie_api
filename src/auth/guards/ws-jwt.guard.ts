import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromQuery(client);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOneBy({ id: payload.id });
      client['user'] = user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(client: Socket): string {
    const token = client.handshake.headers.authorization as string;
    return token;
  }

  // Cambiar para extraer el token desde la query string
  private extractTokenFromQuery(client: Socket): string {
    const token = client.handshake.query.token as string;
    return token;
  }
}
