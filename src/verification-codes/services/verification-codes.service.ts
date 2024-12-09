import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCode } from '../entities/verification-code.entity';
import * as bcrypt from 'bcrypt';
import { VerificationcodeDto } from 'src/auth/dto/verification-code.dto';

@Injectable()
export class VerificationCodesService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationcodeRepository: Repository<VerificationCode>,
  ) {}

  async create() {
    // Generar un código aleatorio de 4 dígitos
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(code);
    const hashCode = bcrypt.hashSync(code, 10);

    // Establecer la fecha de expiración (1 hora y 30 minutos desde ahora)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 90); // 1 hora y 30 minutos

    const newCode = this.verificationcodeRepository.create({
      code: hashCode,
      expirationTime,
    });
    const verificationCode =
      await this.verificationcodeRepository.save(newCode);

    return {
      ...verificationCode,
      code: code,
    };
  }

  async verify(
    verificationcodeDto: VerificationcodeDto,
  ): Promise<VerificationCode | null> {
    const verificationCode = await this.verificationcodeRepository.findOne({
      where: {
        id: verificationcodeDto.id,
      },
    });

    if (!verificationCode) {
      throw new BadRequestException('Incorrect verification code id.');
    }

    if (!bcrypt.compareSync(verificationcodeDto.code, verificationCode.code)) {
      throw new BadRequestException('Incorrect verification code.');
    }
    return verificationCode;
  }
}
