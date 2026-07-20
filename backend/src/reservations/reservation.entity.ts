import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ReservationStatus = 'en_cours' | 'terminée' | 'annulée' | 'confirmée';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('int')
  carId!: number;

  @Column({ length: 80 })
  carBrand!: string;

  @Column({ length: 120 })
  carModel!: string;

  @Column({ length: 120 })
  clientName!: string;

  @Column({ length: 120 })
  clientEmail!: string;

  @Column('date')
  startDate!: string;

  @Column('date')
  endDate!: string;

  @Column('int')
  totalPrice!: number;

  @Column({ type: 'text' })
  status!: ReservationStatus;

  @Column({ length: 120 })
  pickupLocation!: string;
}
