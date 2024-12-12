import { User } from 'src/users/entities/user.entity';
import { Contact } from 'src/contacts/entities/contact.entity';

export class ContactUpdatedEvent {
  user: User;
  contacts: Contact[];
}
