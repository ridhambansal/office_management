import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repo: Repository<Event>,
    private readonly notificationService: NotificationService,
  ) { }


  async create(createEventDto: CreateEventDto) {
    console.log(createEventDto)
    let dat = new Date(createEventDto.date)
    console.log(`${createEventDto.event_name} at ${dat.toLocaleString()}`)
    this.notificationService.sendNotificationToAllUsers('New Event Added, Check it out', `${createEventDto.event_name} at ${dat.toLocaleString()}`)
    return await this.repo.save(createEventDto)
  }

  async findAll() {
    return await this.repo.find()
  }

  async findByDate() {
    const currentDate = new Date();
    let events = await this.repo.createQueryBuilder("event")
      .where("event.date >= :currentDate", { currentDate })
      .getMany();
    if (events.length == 0)
      return []
    return events
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.repo.createQueryBuilder("event")
      .where("event.id = :id", { id }).getOne()
    if (!event)
      throw new NotFoundException(`Event with ID ${id} not found`);
    const updatedEvent = { ...event, ...updateEventDto };
    return this.repo.save(updatedEvent);
  }

  async remove(id: number) {
    const event = await this.repo.createQueryBuilder("event")
      .where("event.id = :id", { id }).getOne()
    if (event)
      return this.repo.delete(id);
    else
      throw new NotFoundException(`Event with ID ${id} not found`);
  }
}

