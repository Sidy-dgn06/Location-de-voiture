import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type UserRole = 'admin' | 'client';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
