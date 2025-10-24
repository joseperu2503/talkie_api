import { ContactResponseDto } from 'src/contact/dto/contact-response.dto';
import { ChatResponseDto } from '../dto/chat-response.dto';
import { Chat } from '../entities/chat.entity';
import { MessageResource } from './message.resource';

export const chatResource = (chat: Chat, userId: string): ChatResponseDto => {
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
    members: receivers,
    unreadMessagesCount: currentChatUser
      ? currentChatUser.unreadMessagesCount
      : 0,
  };
};
