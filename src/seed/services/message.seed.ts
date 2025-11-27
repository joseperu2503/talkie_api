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

  now = new Date();

  daysAgo(days: number, hour: number, minute: number) {
    const d = new Date(this.now);
    d.setDate(d.getDate() - days);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  messages: MessageSeedData[] = [
    // Emily (test2) inicia — hace 2 días
    {
      senderId: 'bcd67ec8-4070-472a-bd1f-a46f3674acc1',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Hey John! Are you free later?',
      fileUrl: null,
      createdAt: this.daysAgo(2, 19, 23),
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'bcd67ec8-4070-472a-bd1f-a46f3674acc1',
      content: 'Yeah, what’s up?',
      fileUrl: null,
      createdAt: this.daysAgo(2, 19, 25),
    },

    // Michael (test3) inicia — ayer
    {
      senderId: '9e234ee4-de1e-4061-8794-6e20b46479da',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Bro, did you watch the highlights?',
      fileUrl: null,
      createdAt: this.daysAgo(1, 14, 10),
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: '9e234ee4-de1e-4061-8794-6e20b46479da',
      content: 'Not yet! Was it that good?',
      fileUrl: null,
      createdAt: this.daysAgo(1, 14, 12),
    },

    // Sarah (test4) — hoy
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'cde012ec-45ac-484c-bd28-08614f0336db',
      content: 'Look at this little one 🐱',
      fileUrl:
        'https://storage.googleapis.com/talkie-e43eb.firebasestorage.app/cca47d1a-5f65-4fd2-8934-76ab8400974c.jpg',
      createdAt: this.daysAgo(4, 9, 40),
    },
    {
      senderId: 'cde012ec-45ac-484c-bd28-08614f0336db',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'OMG 😍 sooo cute! Is it yours?',
      fileUrl: null,
      createdAt: this.daysAgo(4, 9, 42),
    },

    // David (test5) — ayer
    {
      senderId: '75f3a6e3-eea4-48ba-bfa1-9447c7faa7ba',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Coffee tomorrow? ☕',
      fileUrl: null,
      createdAt: this.daysAgo(1, 10, 5),
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: '75f3a6e3-eea4-48ba-bfa1-9447c7faa7ba',
      content: 'Sure! Same place?',
      fileUrl: null,
      createdAt: this.daysAgo(1, 10, 6),
    },

    // Olivia (test6) — hoy
    {
      senderId: 'd32f1f4d-79a9-4e37-8fb7-425e9ef75b40',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'Hey John, can you help me with the report?',
      fileUrl: null,
      createdAt: this.daysAgo(3, 12, 30),
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'd32f1f4d-79a9-4e37-8fb7-425e9ef75b40',
      content: 'Sure, send me what you have 👍',
      fileUrl: null,
      createdAt: this.daysAgo(3, 12, 32),
    },

    // James (test7) — hace 2 días
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: 'e79e7b6c-48c2-40cb-8a57-7dcf7cfe6d94',
      content: 'James, game night at my place?',
      fileUrl: null,
      createdAt: this.daysAgo(2, 20, 45),
    },
    {
      senderId: 'e79e7b6c-48c2-40cb-8a57-7dcf7cfe6d94',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'I’m in! 🎮',
      fileUrl: null,
      createdAt: this.daysAgo(2, 20, 46),
    },

    // Sophia (test8) — hoy por la tarde
    {
      senderId: '2774b4e5-e4cf-4ab2-99fe-f80ecb91ff6d',
      receiverId: '578414e1-f1cd-490b-a92b-767899a0d780',
      content: 'John, I made lasagna today 🍝',
      fileUrl: null,
      createdAt: this.daysAgo(3, 16, 10),
    },
    {
      senderId: '578414e1-f1cd-490b-a92b-767899a0d780',
      receiverId: '2774b4e5-e4cf-4ab2-99fe-f80ecb91ff6d',
      content: 'You’re making me hungry 😂 save me a plate!',
      fileUrl: null,
      createdAt: this.daysAgo(3, 16, 12),
    },
  ];

  async run() {
    for (const user of this.messages) {
      await this.create(user);
    }
  }

  async create(params: MessageSeedData) {
    const { content, fileUrl, senderId, receiverId, createdAt } = params;

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
      sentAt: createdAt,
      createdAt: createdAt,
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
  readonly createdAt: Date;
}
