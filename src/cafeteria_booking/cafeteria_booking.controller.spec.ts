import { Test, TestingModule } from '@nestjs/testing';
import { CafeteriaBookingController } from './cafeteria_booking.controller';
import { CafeteriaBookingService } from './cafeteria_booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeteriaBooking } from './entities/cafeteria_booking.entity';
import { FloorDetailsModule } from '../floor_details/floor_details.module';
import { OverallBookingModule } from '../overall_booking/overall_booking.module';

describe('CafeteriaBookingController', () => {
  let controller: CafeteriaBookingController;
  let service: CafeteriaBookingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CafeteriaBookingController],
      providers: [CafeteriaBookingService],
      imports: [FloorDetailsModule, OverallBookingModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          port: 5432,
          username: 'postgres',
          database: 'postgres',
          password: 'postgres'
        }),
        TypeOrmModule.forFeature([CafeteriaBooking]),
      ],
    }).compile();

    controller = module.get<CafeteriaBookingController>(CafeteriaBookingController);
    service=module.get<CafeteriaBookingService>(CafeteriaBookingService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
