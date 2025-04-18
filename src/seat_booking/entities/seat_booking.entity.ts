import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FloorDetail } from '../../floor_details/entities/floor_detail.entity';

@Entity()
export class SeatBooking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @ManyToOne(() => FloorDetail, (floor) => floor.seatBooking, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'floor_number' })
  floor: FloorDetail;

  @Column()
  status: boolean;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column('varchar', { array: true })
  seat_no: string[];

  @Column('varchar', {
    array: true,
    nullable: true,
    default: () => 'ARRAY[]::varchar[]',
  })
  users?: string[];

  @Column({ type: 'varchar', nullable: true })
  token?: string;
}