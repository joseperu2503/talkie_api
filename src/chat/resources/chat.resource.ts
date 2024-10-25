import { ContactResourceDto } from 'src/contacts/dto/contact-resource.dto';
import { Chat } from '../entities/chat.entity';

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
        lastConnection: new Date(),
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
      ? {
          ...chat.lastMessage,
          isSender: chat.lastMessage.sender.id === userId,
          isImage: isImageUrl(chat.lastMessage.fileUrl),
          sender: {
            id: chat.lastMessage.sender.id,
            name: chat.lastMessage.sender.name,
            surname: chat.lastMessage.sender.surname,
            email: chat.lastMessage.sender.email,
            photo: chat.lastMessage.sender.photo,
          },
        }
      : null,
    messages: sortedMessages.map((message) => {
      const { id, content, timestamp, sender, fileUrl } = message;
      return {
        id,
        content,
        timestamp,
        fileUrl,
        isSender: sender.id === userId,
        isImage: isImageUrl(fileUrl),
        sender: {
          id: sender.id,
          name: sender.name,
          surname: sender.surname,
          email: sender.email,
          photo: sender.photo,
        },
      };
    }),
    receiver: receiver,
    unreadMessagesCount: currentChatUser
      ? currentChatUser.unreadMessagesCount
      : 0,
  };
};

export function isImageUrl(url: string | null): boolean {
  try {
    if (!url) return false;

    const parsedUrl = new URL(url);
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|tif)$/i;
    return imageExtensions.test(parsedUrl.pathname);
  } catch (error) {
    return false; // Si la URL no es válida, devuelve false
  }
}
