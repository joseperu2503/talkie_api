import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  // Cambiar para extraer el token desde la query string
  private extractTokenFromQuery(client: Socket): string {
    const token = client.handshake.query.token as string;
    return token;
  }
}
