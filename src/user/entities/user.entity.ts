import { OverallBooking } from 'src/overall_booking/entities/overall_booking.entity';
import { Role } from '../../role/model/role.enum';
import { SeatBooking } from 'src/seat_booking/entities/seat_booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column({
        nullable: true
    })
    password: string

    @Column({
        unique: true,
        nullable: true
    })
    token: string

    @Column()
    role: Role

    @Column()
    firebaseToken: string
    
    // @ManyToOne(()=>Role, (role)=>role.role_name)
    // role: Role

    // @OneToMany(() => SeatBooking, seatBooking => seatBooking.user)
    // seatBooking: SeatBooking[];

    // @OneToMany(() => OverallBooking, overallBooking => overallBooking.user)
    // overallBooking: OverallBooking[];
}
