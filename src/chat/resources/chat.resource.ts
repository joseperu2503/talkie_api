import { ContactResponseDto } from 'src/contact/dto/contact-response.dto';
import { ChatResponseDto } from '../dto/chat-response.dto';
import { Chat } from '../entities/chat.entity';
import { MessageResource } from './message.resource';

export const chatResource = (chat: Chat, userId: string): ChatResponseDto => {
  const receivers: ContactResponseDto[] = chat.contacts
    .filter((contact) => contact.targetContact.id !== userId)
    .map((contact): ContactResponseDto => {
      const targetContact = contact.targetContact;
      return {
        id: targetContact.id,
        name: targetContact.name,
        surname: targetContact.surname,
        email: targetContact.email,
        photo: targetContact.photo,
        phone: targetContact.phone?.number ?? null,
        isConnected: targetContact.isConnected,
        lastConnection: targetContact.lastConnection,
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
