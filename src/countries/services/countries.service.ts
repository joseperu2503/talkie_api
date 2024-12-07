import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { CreateCountryDto } from '../dto/create-country.dto';
import { countries } from 'src/seed/data/countries';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const { id, name, flag, code, dialCode, mask } = createCountryDto;

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
      const newCountry = this.countryRepository.create(createCountryDto);
      return this.countryRepository.save(newCountry);
    }
  }

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
