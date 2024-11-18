import { ContactResourceDto } from 'src/contacts/dto/contact-resource.dto';
import { Chat } from '../entities/chat.entity';
import { messageResource } from './message.resource';

export const chatResource = (chat: Chat, userId: number) => {
  const receiver: ContactResourceDto = chat.contacts
    .filter((contact) => contact.targetContact.id !== userId)
    .map((contact) => {
      return {
        id: contact.targetContact.id,
        name: contact.targetContact.name,
        surname: contact.targetContact.surname,
        email: contact.targetContact.email,
        photo: contact.targetContact.photo,
        phone: contact.targetContact.phone,
        isConnected: contact.targetContact.isConnected,
        lastConnection: contact.targetContact.lastConnection,
        chatId: chat.id,
      };
    })[0];

  // Encontrar el ChatUser correspondiente al usuario actual
  const currentChatUser = chat.chatUsers.find(
    (chatUser) => chatUser.user.id === userId,
  );

  return {
    id: chat.id,
    lastMessage: chat.lastMessage
      ? messageResource(chat.lastMessage, userId)
      : null,
    receiver: receiver,
    unreadMessagesCount: currentChatUser
      ? currentChatUser.unreadMessagesCount
      : 0,
  };
};
