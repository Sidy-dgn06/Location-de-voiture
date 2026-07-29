import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);
  private readonly email = 'carrent@admin.sn';
  private readonly password = 'AZERTY1234';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.userRepository.findOne({
      where: { email: this.email },
      select: ['id', 'email', 'password', 'role'],
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      const admin = this.userRepository.create({
        fullName: 'Admin CarRent',
        email: this.email,
        phone: '+221 77 801 49 36',
        password: hashedPassword,
        role: 'admin',
      });
      await this.userRepository.save(admin);
      this.logger.log(`Compte admin créé : ${this.email}`);
      return;
    }

    let shouldUpdate = false;
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      shouldUpdate = true;
    }

    const passwordMatches = await bcrypt.compare(this.password, existing.password);
    if (!passwordMatches) {
      existing.password = await bcrypt.hash(this.password, 10);
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      await this.userRepository.save(existing);
      this.logger.log(`Compte admin mis à jour : ${this.email}`);
    } else {
      this.logger.log(`Compte admin déjà présent : ${this.email}`);
    }
  }
}
