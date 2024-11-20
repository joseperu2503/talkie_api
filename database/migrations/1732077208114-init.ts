import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1732077208114 implements MigrationInterface {
    name = 'Init1732077208114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "delivered_at" TIMESTAMP, "read_at" TIMESTAMP, "message_id" uuid, "user_id" integer, CONSTRAINT "PK_5cd64c25bd52ad55f87b084ba63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text, "sent_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_url" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sender_id" integer, "chat_id" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "users_id" integer array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_message" uuid, CONSTRAINT "REL_c79b05bd85c7981c0206e73da9" UNIQUE ("last_message"), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unread_messages_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "chat_id" uuid, "user_id" integer, CONSTRAINT "PK_45f77b7b90225045d6bf7f13756" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fcm_tokens" ("id" SERIAL NOT NULL, "token" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_0802a779d616597e9330bb9a7cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, "surname" text NOT NULL, "phone" text NOT NULL, "username" text NOT NULL, "photo" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_connected" boolean NOT NULL DEFAULT false, "last_connection" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "alias" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "contact_id" integer, "chat_id" uuid, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message_users" ADD CONSTRAINT "FK_3e5325491f3f954d0868e02be24" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message_users" ADD CONSTRAINT "FK_a010171631b98a8881503058233" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_c79b05bd85c7981c0206e73da9b" FOREIGN KEY ("last_message") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fcm_tokens" ADD CONSTRAINT "FK_9fd867cabc75028a5625ce7b24c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_af0a71ac1879b584f255c49c99a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_b85c417d6af2e06ff6ba8c8234d" FOREIGN KEY ("contact_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_44d0b7952a4f30d03393c6940eb" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_44d0b7952a4f30d03393c6940eb"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_b85c417d6af2e06ff6ba8c8234d"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_af0a71ac1879b584f255c49c99a"`);
        await queryRunner.query(`ALTER TABLE "fcm_tokens" DROP CONSTRAINT "FK_9fd867cabc75028a5625ce7b24c"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_c79b05bd85c7981c0206e73da9b"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
        await queryRunner.query(`ALTER TABLE "message_users" DROP CONSTRAINT "FK_a010171631b98a8881503058233"`);
        await queryRunner.query(`ALTER TABLE "message_users" DROP CONSTRAINT "FK_3e5325491f3f954d0868e02be24"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "fcm_tokens"`);
        await queryRunner.query(`DROP TABLE "chat_users"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "message_users"`);
    }

}
