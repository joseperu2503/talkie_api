import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { Repository } from 'typeorm';
import { countries } from '../data/countries';

@Injectable()
export class CountrySeed {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async run() {
    for (const country of countries) {
      await this.create(country);
    }
  }

  async create(params: CountrySeedData) {
    const { id, name, flag, code, dialCode, mask } = params;

    // Verificar si el registro ya existe
    const existingCountry = await this.countryRepository.findOne({
      where: { id },
    });

    if (existingCountry) {
      // Actualizar el registro existente
      existingCountry.name = name;
      existingCountry.flag = flag;
      existingCountry.code = code;
      existingCountry.dialCode = dialCode;
      existingCountry.mask = mask;

      return this.countryRepository.save(existingCountry);
    } else {
      // Crear un nuevo registro
      const newCountry = this.countryRepository.create(params);
      return this.countryRepository.save(newCountry);
    }
  }
}

interface CountrySeedData {
  readonly id: number;
  readonly name: string;
  readonly flag: string;
  readonly code: string;
  readonly dialCode: string;
  readonly mask: string;
}
