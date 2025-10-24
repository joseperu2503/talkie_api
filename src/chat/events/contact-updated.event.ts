import { User } from 'src/auth/entities/user.entity';
import { Contact } from 'src/contact/entities/contact.entity';

export class ContactUpdatedEvent {
  user: User;
  contacts: Contact[];
}
