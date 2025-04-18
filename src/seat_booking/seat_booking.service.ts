// src/seat_booking/seat_booking.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SeatBooking } from './entities/seat_booking.entity';
import { CreateSeatBookingDto } from './dto/create-seat_booking.dto';
import { UpdateSeatBookingDto } from './dto/update-seat_booking.dto';

import { FloorDetailsService } from '../floor_details/floor_details.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { OverallBookingService } from '../overall_booking/overall_booking.service';

@Injectable()
export class SeatBookingService {
  constructor(
    @InjectRepository(SeatBooking)
    private readonly repo: Repository<SeatBooking>,
    private readonly floordetailsService: FloorDetailsService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => OverallBookingService))
    private readonly overallBookingService: OverallBookingService,
  ) {}

  /** Flatten every booked seat from existing bookings */
  private getBookedSeatNumbers(
    existing: string[],
    bookings: SeatBooking[],
  ): string[] {
    for (const b of bookings) {
      for (const sno of b.seat_no) {
        existing.push(sno.replace(/[\[\]\{\}]/g, ''));
      }
    }
    return existing;
  }

  /** Generate seat IDs from start up to end, inclusive */
  private async getSeatNumbersInRange(
    start: string,
    end: string,
  ): Promise<string[]> {
    const seats: string[] = [];
    const prefix = start.slice(0, -3).trimEnd();
    let current = start;

    while (current !== end && current < end) {
      seats.push(current);
      const parts = current.split(' ');
      const nextNum = parseInt(parts[2], 10) + 1;
      const numStr =
        nextNum < 10
          ? `00${nextNum}`
          : nextNum < 100
          ? `0${nextNum}`
          : `${nextNum};`
      current = `${prefix} ${numStr}`;
    }
    seats.push(end);
    return seats;
  }

  /** Find a contiguous block of capacity seats in available */
  private getConsecutiveSeats(
    capacity: number,
    available: string[],
  ): string[] {
    const indices = new Set<number>();
    for (const s of available) {
      indices.add(parseInt(s.split(' ')[2], 10));
    }

    for (const s of available) {
      const base = parseInt(s.split(' ')[2], 10);
      if (!indices.has(base - 1)) {
        const block: string[] = [];
        for (let j = base; j < base + capacity; j++) {
          if (!indices.has(j)) break;
          const numStr =
            j < 10 ? `00${j} : j < 100 ? 0${j}` : `${j}`;
          block.push(`${s.split(' ').slice(0, 2).join(' ')} ${numStr}`);
        }
        if (block.length === capacity) {
          return block;
        }
      }
    }
    return [];
  }

  /** Create a new seat booking */
  async create(dto: CreateSeatBookingDto) {
    // 1️⃣ require either explicit seats or a positive capacity
    if ((!dto.seat_no?.length) && !(dto.capacity! > 0)) {
      throw new HttpException(
        'You must supply either a positive capacity or a non-empty seat_no array',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    // 2️⃣ normalize booking date to midnight UTC
    const bookingDate = new Date(dto.date);
    bookingDate.setUTCHours(0, 0, 0, 0);
  
    // 3️⃣ fetch the FloorDetail entity
    const floorInfo = await this.floordetailsService.getFloorDet(
      dto.floor_number,
    );
    if (!floorInfo.length) {
      throw new HttpException('Floor not found', HttpStatus.BAD_REQUEST);
    }
    const floor = floorInfo[0];
  
    // 4️⃣ decide which seats to book
    let toBook: string[];
    if (dto.seat_no?.length) {
      toBook = dto.seat_no;
    } else {
      const bookingsToday = await this.repo.find({
        relations: ['floor'],
        where: {
          date: bookingDate,
          floor: { floor_number: floor.floor_number },
        },
      });
  
      const occupied = this.getBookedSeatNumbers([], bookingsToday);
      const allSeats = await this.getSeatNumbersInRange(
        floor.starting_seat_no,
        floor.ending_seat_no,
      );
      const available = allSeats.filter((s) => !occupied.includes(s));
      toBook = this.getConsecutiveSeats(dto.capacity!, available);
  
      if (!toBook.length) {
        throw new HttpException('Seats not found', HttpStatus.BAD_REQUEST);
      }
    }
  
    // 5️⃣ build & save via the relation
    const entity = this.repo.create({
      floor,
      date: bookingDate,
      status: dto.status,
      seat_no: toBook,
      users: dto.users ?? [],
      token: dto.token,
    });
    const saved = await this.repo.save(entity);
  
    // 6️⃣ create overall booking record
    const details = [
      saved.floor.floor_number.toString(),
      saved.seat_no.join(','),
      ...(saved.users ?? []),
    ];
    const overallPayload: any = {
      bookingID: saved.booking_id,
      amenity: 'Seating',
      date: bookingDate,
      details,
      ...(saved.token ? { token: saved.token } : {}),
    };
    const overall = await this.overallBookingService.create(overallPayload);
  
    // 7️⃣ (notifications removed per request)
  
    // 8️⃣ return the overall‑booking record
    return overall;
  }

  /** Return all bookings */
  findAll() {
    return this.repo.find({ relations: ['floor'] });
  }

  /** Return bookings by ID */
  async findOne(id: number) {
    const bookings = await this.repo.find({
      relations: ['floor'],
      where: { booking_id: id },
    });
    if (!bookings.length) {
      throw new HttpException('Booking not found', HttpStatus.BAD_REQUEST);
    }
    return bookings;
  }

  /** Replace an existing booking */
  async update(id: number, dto: UpdateSeatBookingDto) {
    await this.remove(id);
    return this.create(dto as CreateSeatBookingDto);
  }

  /** Delete a booking */
  async remove(id: number) {
    await this.repo.delete(id);
    return this.overallBookingService.deleteByID(id, 'Seating');
  }

  /** Find future bookings by token */
  async getByToken(token: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const all = await this.repo
      .createQueryBuilder('booking')
      .where('booking.date >= :date', { date: today })
      .getMany();

    const filtered = all.filter(
      (b) => b.token === token || (b.users ?? []).includes(token),
    );
    if (!filtered.length) {
      throw new HttpException('Booking not found', HttpStatus.BAD_REQUEST);
    }
    return { seatsData: filtered };
  }

  /**
   * Overall availability for a given date.
   * Now accepts an optional Date argument so your controller can pass one in.
   */
  async getAvailDate(date?: Date) {
    const target = date ?? new Date();
    target.setUTCHours(0, 0, 0, 0);

    const total = await this.floordetailsService.findTotalCapacity();
    const booked = await this.repo.find({ where: { date: target } });
    const used = booked.reduce((sum, b) => sum + b.seat_no.length, 0);

    return total - used;
  }

  /** Floor‑wise availability for a given date */
  async getAvailDateFloor(date: Date) {
    const target = new Date(date);
    target.setUTCHours(0, 0, 0, 0);

    const floors = await this.floordetailsService.findAll();
    const bookings = await this.repo.find({
      relations: ['floor'],
      where: { date: target },
    });

    const availability = floors.map((f) => {
      const usedSeats = bookings
        .filter((b) => b.floor.floor_number === f.floor_number)
        .reduce((sum, b) => sum + b.seat_no.length, 0);
      return {
        floor_number: f.floor_number - 1,
        floor_name: f.floor_name,
        available: f.capacity - usedSeats,
      };
    });

    return { Availability: availability };
  }
}