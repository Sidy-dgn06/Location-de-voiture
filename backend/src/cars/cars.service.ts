import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createCarDto: CreateCarDto) {
    const car = this.carRepository.create(createCarDto);
    const savedCar = await this.carRepository.save(car);
    await this.clearCache(savedCar.id);
    return savedCar;
  }

  findAll() {
    return this.cacheManager.wrap('cars:all', () => this.carRepository.find(), {
      ttl: 60,
    });
  }

  async findOne(id: number) {
    const car = await this.cacheManager.wrap(`cars:${id}`, () =>
      this.carRepository.findOne({ where: { id } }),
    );

    if (!car) throw new NotFoundException('Véhicule introuvable.');
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.findOne(id);
    Object.assign(car, updateCarDto);
    const updatedCar = await this.carRepository.save(car);
    await this.clearCache(updatedCar.id);
    return updatedCar;
  }

  async remove(id: number) {
    const car = await this.findOne(id);
    await this.carRepository.remove(car);
    await this.clearCache(id);
    return { message: 'Véhicule supprimé.' };
  }

  private async clearCache(id?: number) {
    await this.cacheManager.del('cars:all');
    if (id) {
      await this.cacheManager.del(`cars:${id}`);
    }
  }
}
