import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(['admin', 'client'])
  role!: 'admin' | 'client';
}
