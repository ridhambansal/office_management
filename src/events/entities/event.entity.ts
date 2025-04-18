import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_name: string;

  @Column()
  date: Date;

  @Column()
  description: string;
}