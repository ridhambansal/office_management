import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCafeteriaBookingDto } from './dto/create-cafeteria_booking.dto';
import { UpdateCafeteriaBookingDto } from './dto/update-cafeteria_booking.dto';
import { GetAvailaBilityDto } from './dto/get-availability.dto';
import { CafeteriaBooking } from './entities/cafeteria_booking.entity';
import { FloorDetailsService } from '../floor_details/floor_details.service';
import { OverallBookingService } from '../overall_booking/overall_booking.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CafeteriaBookingService {
  constructor(
    @InjectRepository(CafeteriaBooking)
    private readonly repo: Repository<CafeteriaBooking>,

    private readonly floordetailsService: FloorDetailsService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,

    @Inject(forwardRef(() => OverallBookingService))
    private readonly overallBookingService: OverallBookingService,
  ) {}

  // async create(userToken: string, dto: CreateCafeteriaBookingDto) {
  //   // ensure date objects
  //   dto.date = new Date(dto.date);
  //   dto.start_time = new Date(dto.start_time);
  //   dto.end_time = new Date(dto.end_time);

  //   // save cafeteria booking
  //   const booking = await this.repo.save({ ...dto, token: userToken });

  //   // build overall‑booking payload
  //   const details = [
  //     dto.start_time.toISOString(),
  //     dto.end_time.toISOString(),
  //   ];
  //   const overall = {
  //     amenity: 'Cafeteria',
  //     bookingID: booking.booking_id,
  //     date: dto.date,
  //     details,
  //     token: userToken,
  //   };

  //   // fetch user for notifications
  //   const userRecord = (await this.userService.findOne(userToken))[0];
  //   const notifTime = new Date(
  //     `${dto.date.toISOString().split('T')[0]}T${dto.start_time.toLocaleTimeString('en-US', { hour12: false })}`
  //   );

  //   // Immediate notification
  //   await this.notificationService.createNotification(
  //     notifTime,
  //     'Cafeteria booked',
  //     details.join(' '),
  //     userRecord.firebaseToken,
  //   );

  //   // Day-before notification
  //   const dayBefore = new Date(notifTime);
  //   dayBefore.setDate(dayBefore.getDate() - 1);
  //   await this.notificationService.createNotification(
  //     dayBefore,
  //     'Upcoming Cafeteria booking',
  //     details.join(' '),
  //     userRecord.firebaseToken,
  //   );

  //   return this.overallBookingService.create(overall);
  // }
  async create(userToken: string, dto: CreateCafeteriaBookingDto) {
    // -- DEBUG --
    console.log('▶️  create() userToken:', userToken);
    // ------------
  
    // convert to Date
    dto.date       = new Date(dto.date);
    dto.start_time = new Date(dto.start_time);
    dto.end_time   = new Date(dto.end_time);
  
    // fallback to a placeholder if somehow undefined
    const tokenToSave = userToken ?? 'UNKNOWN_USER';
  
    const booking = await this.repo.save({
      ...dto,
      token: tokenToSave,    // ← uses fallback if needed
    });
  
    // build overall‑booking payload
    const details = [
      dto.start_time.toISOString(),
      dto.end_time.toISOString(),
    ];
    const overall = {
      amenity:   'Cafeteria',
      bookingID: booking.booking_id,
      date:      dto.date,
      details,
      token:     tokenToSave,
    };
  
    // fetch user (this will probably return nothing if token was wrong)
    const userRecord = (await this.userService.findOne(tokenToSave))[0] || {};
    const firebaseToken = userRecord.firebaseToken ?? '<no-firebase-token>';
  
    const notifTime = new Date(
      `${dto.date.toISOString().split('T')[0]}T${dto.start_time.toLocaleTimeString('en-US',{hour12:false})}`
    );
  
    // Immediate notification
    await this.notificationService.createNotification(
      notifTime,
      'Cafeteria booked',
      details.join(' '),
      firebaseToken,
    );
  
    // Day‑before notification
    const dayBefore = new Date(notifTime);
    dayBefore.setDate(dayBefore.getDate() - 1);
    await this.notificationService.createNotification(
      dayBefore,
      'Upcoming Cafeteria booking',
      details.join(' '),
      firebaseToken,
    );
  
    return this.overallBookingService.create(overall);
  }
  
  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const booking = await this.repo.findOne({ where: { booking_id: id } });
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    return booking;
  }

  update(id: number, dto: UpdateCafeteriaBookingDto) {
    if (dto.date) dto.date = new Date(dto.date);
    if (dto.start_time) dto.start_time = new Date(dto.start_time);
    if (dto.end_time) dto.end_time = new Date(dto.end_time);

    this.repo.update(id, dto);
    return this.overallBookingService.update(id, dto, 'Cafeteria');
  }

  remove(id: number) {
    this.repo.delete(id);
    return this.overallBookingService.deleteByID(id, 'Cafeteria');
  }

  async getAvailDate() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const floor = (await this.floordetailsService.getFloorDet(5))[0];
    const bookings = await this.repo.find({ where: { date: today } });
    return floor.capacity - bookings.length;
  }

  async getByToken(token: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const bookings = await this.repo
      .createQueryBuilder('cafebooking')
      .where('cafebooking.token = :token', { token })
      .andWhere('cafebooking.date >= :today', { today })
      .getMany();

    if (!bookings.length) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    return { cafeteriaData: bookings };
  }

  async getAvailDateTime(dto: GetAvailaBilityDto) {
    const dateOnly = new Date(dto.date);
    dateOnly.setUTCHours(0, 0, 0, 0);

    const bookingsByDate = await this.repo
      .createQueryBuilder('booking')
      .where('booking.date = :date', { date: dateOnly })
      .andWhere(
        '(booking.start_time < :end_time AND booking.start_time >= :start_time)',
        { start_time: dto.start_time, end_time: dto.end_time },
      )
      .orWhere(
        '(booking.end_time <= :end_time AND booking.start_time > :start_time)',
        { start_time: dto.start_time, end_time: dto.end_time },
      )
      .orWhere(
        '(booking.start_time <= :end_time AND booking.end_time >= :start_time)',
        { start_time: dto.start_time, end_time: dto.end_time },
      )
      .getMany();

    const bookedSeats = bookingsByDate.length;
    const floor = (await this.floordetailsService.getFloorDet(5))[0];
    return floor.capacity - bookedSeats;
  }
}
