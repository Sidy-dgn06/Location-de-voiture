import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type CarCategory = 'economique' | 'confort' | 'luxe' | 'suv';
export type Transmission = 'automatique' | 'manuelle';
export type Fuel = 'essence' | 'diesel' | 'électrique';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 80 })
  brand!: string;

  @Column({ length: 120 })
  model!: string;

  @Column('int')
  year!: number;

  @Column('int')
  price!: number;

  @Column({ type: 'text' })
  category!: CarCategory;

  @Column('int')
  seats!: number;

  @Column({ type: 'text' })
  transmission!: Transmission;

  @Column({ type: 'text' })
  fuel!: Fuel;

  @Column('boolean', { default: true })
  available!: boolean;

  @Column({ length: 300 })
  image!: string;

  @Column('float', { default: 0 })
  rating!: number;

  @Column('int', { default: 0 })
  reviews!: number;
}
