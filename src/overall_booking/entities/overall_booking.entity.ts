// src/overall_booking/entities/overall_booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('overall_booking')
export class OverallBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  amenity: string;

  @Column({ name: 'bookingID' })
  bookingID: number;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  date: Date;

  @Column('text', { array: true })
  details: string[];
}