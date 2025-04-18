import { Entity, PrimaryGeneratedColumn, Column, Timestamp, Unique } from 'typeorm';

@Entity()
// @Unique('composite keys', ['date', 'start_time', 'end_time'])
export class CafeteriaBooking {
    @PrimaryGeneratedColumn()
    booking_id: number

    @Column()
    token: string

    @Column({ type: 'timestamptz' })
    date: Date

    @Column({ type: 'timestamptz' })
    start_time: Date

    @Column({ type: 'timestamptz' })
    end_time: Date


}
