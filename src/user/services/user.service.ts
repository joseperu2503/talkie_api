import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserStatusRequestDto } from 'src/chat/dto/update-user-status-request.dto';
import { ContactUpdatedEvent } from 'src/chat/events/contact-updated.event';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private eventEmitter: EventEmitter2,
  ) {}

  async findOne(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async updateStatus(
    user: User,
    updateUserStatusDto: UpdateUserStatusRequestDto,
  ) {
    // Actualizar el estado de conexión del usuario
    user.isConnected = updateUserStatusDto.isConnected;
    if (!updateUserStatusDto.isConnected) {
      user.lastConnection = new Date();
    }
    await this.userRepository.save(user);

    const contacts = await this.getContacts(user.id);
    if (!contacts) return;

    const contactUpdatedEvent = new ContactUpdatedEvent();
    contactUpdatedEvent.contacts = contacts;
    contactUpdatedEvent.user = user;

    this.eventEmitter.emit('contact.updated', contactUpdatedEvent);
  }

  async getContacts(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        initiatedContacts: {
          chat: true,
          targetContact: true,
        },
      },
    });

    return user?.initiatedContacts;
  }
}
