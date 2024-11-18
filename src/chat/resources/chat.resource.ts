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

  // Ordenar los mensajes por timestamp de manera descendente
  const sortedMessages = chat.messages.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return {
    id: chat.id,
    lastMessage: chat.lastMessage
      ? messageResource(chat.lastMessage, userId)
      : null,
    // messages: sortedMessages.map((message) => {
    //   return messageResource(message, userId);
    // }),
    messages: [],
    receiver: receiver,
    unreadMessagesCount: currentChatUser
      ? currentChatUser.unreadMessagesCount
      : 0,
  };
};
