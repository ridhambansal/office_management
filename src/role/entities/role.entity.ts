import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    role_id: number

    @Column()
    role_name: string

    // @OneToMany(()=>User, (user)=>user.role)
    // users: User[]
}
