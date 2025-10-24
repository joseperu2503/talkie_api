import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ChatUser } from 'src/chat/entities/chat-user.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { MessageUser } from 'src/chat/entities/message-user.entity';
import { Message } from 'src/chat/entities/message.entity';
import { File } from 'src/file/entities/files.entity';
import { ArrayContains, Repository } from 'typeorm';

@Injectable()
export class MessageSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,

    @InjectRepository(MessageUser)
    private messageUserRepository: Repository<MessageUser>,

    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  messages: MessageSeedData[] = [
    // Emily (test2) inicia
    {
      senderId: 'bcd67ec8-4070-472a-bd1f-a46f3674acc1',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Hey John! Are you free later?',
      fileUrl: null,
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'bcd67ec8-4070-472a-bd1f-a46f3674acc1',
      content: 'Yeah, what’s up?',
      fileUrl: null,
    },

    // Michael (test3) inicia
    {
      senderId: '9e234ee4-de1e-4061-8794-6e20b46479da',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Bro, did you watch the highlights?',
      fileUrl: null,
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: '9e234ee4-de1e-4061-8794-6e20b46479da',
      content: 'Not yet! Was it that good?',
      fileUrl: null,
    },

    // John inicia con Sarah (test4) mostrando foto del gato
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'cde012ec-45ac-484c-bd28-08614f0336db',
      content: 'Look at this little one 🐱',
      fileUrl:
        'https://storage.googleapis.com/talkie-e43eb.firebasestorage.app/cca47d1a-5f65-4fd2-8934-76ab8400974c.jpg',
    },
    {
      senderId: 'cde012ec-45ac-484c-bd28-08614f0336db',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'OMG 😍 sooo cute! Is it yours?',
      fileUrl: null,
    },

    // David (test5) inicia
    {
      senderId: '75f3a6e3-eea4-48ba-bfa1-9447c7faa7ba',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Coffee tomorrow? ☕',
      fileUrl: null,
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: '75f3a6e3-eea4-48ba-bfa1-9447c7faa7ba',
      content: 'Sure! Same place?',
      fileUrl: null,
    },

    // Olivia (test6) inicia
    {
      senderId: 'd32f1f4d-79a9-4e37-8fb7-425e9ef75b40',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Hey John, can you help me with the report?',
      fileUrl: null,
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'd32f1f4d-79a9-4e37-8fb7-425e9ef75b40',
      content: 'Sure, send me what you have 👍',
      fileUrl: null,
    },

    // John inicia con James (test7)
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'e79e7b6c-48c2-40cb-8a57-7dcf7cfe6d94',
      content: 'James, game night at my place?',
      fileUrl: null,
    },
    {
      senderId: 'e79e7b6c-48c2-40cb-8a57-7dcf7cfe6d94',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'I’m in! 🎮',
      fileUrl: null,
    },

    // Sophia (test8) inicia
    {
      senderId: '2774b4e5-e4cf-4ab2-99fe-f80ecb91ff6d',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'John, I made lasagna today 🍝',
      fileUrl: null,
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: '2774b4e5-e4cf-4ab2-99fe-f80ecb91ff6d',
      content: 'You’re making me hungry 😂 save me a plate!',
      fileUrl: null,
    },
  ];

  async run() {
    for (const user of this.messages) {
      await this.create(user);
    }
  }

  async create(params: MessageSeedData) {
    const { content, fileUrl, senderId, receiverId } = params;

    const sender = await this.userRepository.findOne({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      return;
    }

    const receiver = await this.userRepository.findOne({
      where: {
        id: receiverId,
      },
    });

    if (!receiver) {
      return;
    }

    const chat = await this.chatRepository.findOne({
      where: {
        usersId: ArrayContains([sender.id, receiver.id]),
      },
      relations: {
        chatUsers: {
          user: {
            fcmTokens: true,
          },
        },
        lastMessage: {
          sender: true,
          messageUsers: true,
          chat: true,
        },
        contacts: {
          targetContact: true,
        },
      },
    });

    if (!chat) {
      return;
    }

    let file: File | null = null;

    if (fileUrl) {
      file = await this.fileRepository.save({
        name: fileUrl.split('/').pop()!,
        mimetype: 'image/jpeg',
        url: fileUrl,
        size: 198045,
      });
    }

    // // Crear y guardar el mensaje
    const message = this.messageRepository.create({
      content,
      sender,
      chat,
      fileId: file?.id ?? null,
      messageUsers: [],
    });

    await this.messageRepository.save(message);

    await this.chatRepository.update(chat.id, { lastMessage: message });

    // Incrementar los mensajes no leídos en los chatUsers (excepto para el remitente)
    const chatUsersToUpdate = chat.chatUsers.filter(
      (chatUser) => chatUser.user.id !== sender.id,
    );

    for (const chatUser of chatUsersToUpdate) {
      chatUser.unreadMessagesCount += 1;
      await this.chatUserRepository.save(chatUser);

      // Crear el MessageUser
      const messageUser = this.messageUserRepository.create();
      messageUser.message = message;
      messageUser.user = chatUser.user;

      await this.messageUserRepository.save(messageUser);

      message.messageUsers.push(messageUser);
    }

    // Resetear contador de no leídos para el remitente
    const senderChatUser = chat.chatUsers.find(
      (chatUser) => chatUser.user.id === sender.id,
    );

    if (senderChatUser) {
      senderChatUser.unreadMessagesCount = 0;
      await this.chatUserRepository.save(senderChatUser);
    }
  }
}

interface MessageSeedData {
  readonly senderId: string;
  readonly receiverId: string;
  readonly content: string | null;
  readonly fileUrl: string | null;
}
