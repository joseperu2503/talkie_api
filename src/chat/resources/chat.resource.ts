import { ContactResponseDto } from 'src/contacts/dto/contact-response.dto';
import { Chat } from '../entities/chat.entity';
import { MessageResource } from './message.resource';

export const chatResource = (chat: Chat, userId: number) => {
  const receivers: ContactResponseDto[] = chat.contacts
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
    });

  // Encontrar el ChatUser correspondiente al usuario actual
  const currentChatUser = chat.chatUsers.find(
    (chatUser) => chatUser.user.id === userId,
  );

  return {
    id: chat.id,
    lastMessage: chat.lastMessage
      ? new MessageResource(chat.lastMessage, userId).response
      : null,
    receivers: receivers,
    unreadMessagesCount: currentChatUser
      ? currentChatUser.unreadMessagesCount
      : 0,
  };
};
