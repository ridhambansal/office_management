import { MeetingroomBooking } from '../../meetingroom_booking/entities/meetingroom_booking.entity';
import { MeetingroomDetail } from '../../meetingroom_details/entities/meetingroom_detail.entity';
import { SeatBooking } from '../../seat_booking/entities/seat_booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';

@Entity()
@Unique(['floor_number'])
export class FloorDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    floor_number: number

    @Column()
    floor_name: string

    @Column()
    capacity: number

    @Column()
    no_meeting_rooms: number

    @Column()
    starting_seat_no: string

    @Column()
    ending_seat_no: string

    @OneToMany(() => SeatBooking, (seatBooking) => seatBooking.floor)
seatBooking: SeatBooking[];

  @OneToMany(() => MeetingroomDetail, (meetingRoom) => meetingRoom.floor)
    meetingRoom: MeetingroomDetail[]

  @OneToMany(
    () => MeetingroomBooking,
    (meetingroomBooking) => meetingroomBooking.floor)
    meetingroomBooking: MeetingroomBooking[]
}
