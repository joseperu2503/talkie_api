import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from '../entities/phone.entity';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}

  async findOrCreate(number: string, countryId: number) {
    const phoneExists = await this.phoneRepository.findOne({
      where: { number: number, countryId: countryId },
    });

    if (phoneExists) {
      return phoneExists;
    }

    const phone = this.phoneRepository.create({
      number,
      countryId,
    });

    return this.phoneRepository.save(phone);
  }
}
