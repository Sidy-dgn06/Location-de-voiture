import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  findAll() {
    return this.userRepository.find({ select: ['id', 'fullName', 'email', 'phone', 'role', 'createdAt'] });
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, select: ['id', 'fullName', 'email', 'phone', 'role', 'createdAt'] });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return user;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    user.role = updateRoleDto.role;
    await this.userRepository.save(user);
    return { message: 'Rôle mis à jour avec succès.' };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    await this.userRepository.remove(user);
    return { message: 'Utilisateur supprimé.' };
  }
}
