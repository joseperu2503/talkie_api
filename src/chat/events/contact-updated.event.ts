import { Contact } from 'src/contacts/entities/contact.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class ContactUpdatedEvent {
  user: UserEntity;
  contacts: Contact[];
}
