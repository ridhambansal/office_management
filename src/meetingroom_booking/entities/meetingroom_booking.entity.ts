import { FloorDetail } from "../../floor_details/entities/floor_detail.entity";
import { MeetingroomDetail } from "../../meetingroom_details/entities/meetingroom_detail.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique('composite-keys', ['date', 'start_time', 'end_time', 'meetingRoom'])
export class MeetingroomBooking {
    @PrimaryGeneratedColumn()
    booking_id: number

    @Column()
    token: string

    @Column()
    floorId: number

    @ManyToOne(()=>FloorDetail, floor=>floor.meetingroomBooking)
    floor: FloorDetail

    @Column({ type: 'timestamptz' })
    date: Date

    @Column()
  room_id: number;

    @Column({type: 'timestamptz'})
    start_time: Date

    @Column({type: 'timestamptz'})
    end_time: Date

    @ManyToOne(()=>MeetingroomDetail, meetingRoom=>meetingRoom.meetingroomBooking)
    meetingRoom: MeetingroomDetail

    @Column()
    room_name: string

    @Column()
    status: Boolean

    @Column('text', { array: true })
    users: string[]
    
}