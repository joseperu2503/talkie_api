import { User } from 'src/auth/entities/user.entity';
import { Contact } from 'src/contacts/entities/contact.entity';

export class ContactUpdatedEvent {
  user: User;
  contacts: Contact[];
}
