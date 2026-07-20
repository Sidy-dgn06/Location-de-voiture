import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'admin' | 'client';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 120 })
  fullName!: string;

  @Column({ length: 120, unique: true })
  email!: string;

  @Column({ length: 20 })
  phone!: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: 'text', default: 'client' })
  role!: UserRole;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
