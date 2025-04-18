// src/meetingroom-detail.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { FloorDetail } from '../../floor_details/entities/floor_detail.entity';
  import { MeetingroomBooking } from '../../meetingroom_booking/entities/meetingroom_booking.entity';
  
  @Entity('meetingroom_detail')
  export class MeetingroomDetail {
    @PrimaryGeneratedColumn({ name: 'room_id' })
    roomId: number;
  
    @Column({ name: 'room_name' })
    room: string;
  
    @Column()
    capacity: number;
  
    // ← NO explicit floorId column here
    @ManyToOne(() => FloorDetail, (floor) => floor.meetingRoom, {
      nullable: false,       // enforce NOT NULL at the relation level
      onDelete: 'RESTRICT',  // or CASCADE as your domain requires
    })
    @JoinColumn({ name: 'floorId' })
    floor: FloorDetail;     // TypeORM will create a floorId FK under the hood
  
    @OneToMany(
      () => MeetingroomBooking,
      (booking) => booking.meetingRoom,
    )
    meetingroomBooking: MeetingroomBooking[];
  }