import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async getAllCountries() {
    const countries = await this.countryRepository.find();

    return countries;
  }

  async findOne(countryId: number) {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    return country!;
  }

  async findOneWithExeption(countryId: number) {
    const country = await this.findOne(countryId);

    if (!country) {
      throw new NotFoundException(
        `Phone Country with ID ${countryId} not found.`,
      );
    } else {
      return country;
    }
  }
}
