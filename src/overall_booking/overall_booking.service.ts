// src/overall_booking/overall_booking.service.ts
import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { OverallBooking } from './entities/overall_booking.entity';
import { CreateOverallBookingDto } from './dto/create-overall_booking.dto';

import { MeetingroomBookingService } from '../meetingroom_booking/meetingroom_booking.service';
import { SeatBookingService }       from '../seat_booking/seat_booking.service';
import { CafeteriaBookingService }  from '../cafeteria_booking/cafeteria_booking.service';
import { EventsService }            from '../events/events.service';

@Injectable()
export class OverallBookingService {
  constructor(
    @InjectRepository(OverallBooking)
    private readonly repo: Repository<OverallBooking>,

    @Inject(forwardRef(() => MeetingroomBookingService))
    private readonly meetingRoomService: MeetingroomBookingService,

    @Inject(forwardRef(() => SeatBookingService))
    private readonly seatService: SeatBookingService,

    @Inject(forwardRef(() => CafeteriaBookingService))
    private readonly cafeteriaService: CafeteriaBookingService,

    private readonly eventsService: EventsService,
  ) {}

  /** Roll up all three amenity‐services into overall_booking rows */
  async add(dto: CreateOverallBookingDto): Promise<OverallBooking[]> {
    const { token } = dto;

    const [allCafes, allRooms, allSeats] = await Promise.all([
      this.cafeteriaService.findAll(),
      this.meetingRoomService.findAll(),
      this.seatService.findAll(),
    ]);

    const cafes = allCafes.filter(b => b.token === token);
    const rooms = allRooms.filter(b => b.token === token);
    const seats = allSeats.filter(b => b.token === token);

    if (![...cafes, ...rooms, ...seats].length) {
      throw new NotFoundException(`No bookings found for token "${token}"`);
    }

    const overallEntities: Partial<OverallBooking>[] = [];

    cafes.forEach(b =>
      overallEntities.push({
        token,
        amenity: 'cafeteria',
        bookingID: b.booking_id,
        date: new Date(b.date),
        details: [
          new Date(b.start_time).toISOString(),
          new Date(b.end_time).toISOString(),
        ],
      }),
    );

    rooms.forEach(b =>
      overallEntities.push({
        token,
        amenity: 'meetingRoom',
        bookingID: b.booking_id,
        date: new Date(b.date),
        details: [
          new Date(b.start_time).toISOString(),
          new Date(b.end_time).toISOString(),
        ],
      }),
    );

    seats.forEach(b =>
      overallEntities.push({
        token,
        amenity: 'seat',
        bookingID: b.booking_id,
        date: new Date(b.date),
        details: b.seat_no,
      }),
    );

    return this.repo.save(overallEntities);
  }

  /** Convenience: create a single OverallBooking row */
  async create(payload: Partial<OverallBooking>): Promise<OverallBooking> {
    return this.repo.save(payload);
  }

  /** Return every overall_booking row */
  async findAll(): Promise<OverallBooking[]> {
    return this.repo.find();
  }

  /** Find by PK */
  async findOne(id: number): Promise<OverallBooking> {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException(`OverallBooking ${id} not found`);
    return rec;
  }

  /** Find by the amenity’s own bookingID */
  async findByBidAmenity(
    bookingID: number,
    amenity: string,
  ): Promise<OverallBooking[]> {
    return this.repo.find({ where: { bookingID, amenity } });
  }

  /**
   * Update date / time‐window for a given amenity booking,
   * accepts any DTO with { date?, start_time?, end_time? }
   */
   async update(
    bookingID: number,
    updateFields: {
      date?: string | Date;
      start_time?: string | Date;
      end_time?: string | Date;
    },
    amenity: string,
  ): Promise<OverallBooking> {
    const [rec] = await this.repo.find({ where: { bookingID, amenity } });
    if (!rec) throw new NotFoundException();
  
    // normalize 'date'
    if (updateFields.date) {
      rec.date =
        updateFields.date instanceof Date
          ? updateFields.date
          : new Date(updateFields.date);
    }
  
    // normalize start/end
    if (updateFields.start_time && updateFields.end_time) {
      const start =
        updateFields.start_time instanceof Date
          ? updateFields.start_time
          : new Date(updateFields.start_time);
      const end =
        updateFields.end_time instanceof Date
          ? updateFields.end_time
          : new Date(updateFields.end_time);
  
      if (start < end) {
        rec.details = [start.toISOString(), end.toISOString()];
      } else {
        throw new BadRequestException('start_time must be before end_time');
      }
    }
  
    return this.repo.save(rec);
  }

  /** For MeetingRoomService’s special case */
  async updateMeetingRoom(
    bookingID: number,
    updated: OverallBooking,
  ): Promise<OverallBooking> {
    const ob = await this.repo.findOne({
      where: { bookingID, amenity: 'Meeting Room' },
    });
    if (!ob) {
      throw new NotFoundException(
        `Overall booking for Meeting Room #${bookingID} not found`,
      );
    }

    // copy mutated fields
    ob.date = updated.date;
    ob.details = updated.details;
    // no token field here

    return this.repo.save(ob);
  }

  /** Delete by the amenity’s bookingID */
  async deleteByID(bookingID: number, amenity: string): Promise<DeleteResult> {
    const [rec] = await this.repo.find({ where: { bookingID, amenity } });
    if (!rec) {
      throw new NotFoundException(
        `Booking ${bookingID} for ${amenity} not found`,
      );
    }
    return this.repo.delete(rec.id);
  }

  /** Delete by PK */
  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`OverallBooking ${id} not found`);
    }
  }

  /** Build the homescreen payload */
  async homescreenAPI(token: string) {
    const overall = await this.repo
      .createQueryBuilder('o')
      .where('o.token = :token', { token })
      .andWhere('o.date >= CURRENT_DATE')
      .getMany();

    const events    = await this.eventsService.findByDate();
    const mrCount   = await this.meetingRoomService.getTotalAvailability();
    const seatCount = await this.seatService.getAvailDate();
    const cafeCount = await this.cafeteriaService.getAvailDate();

    return {
      overall,
      events,
      meetingRoom: mrCount,
      seats: seatCount,
      cafeteria: cafeCount,
    };
  }
}