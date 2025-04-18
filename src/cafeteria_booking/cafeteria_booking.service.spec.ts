import { Test, TestingModule } from '@nestjs/testing';
import { CafeteriaBookingService } from './cafeteria_booking.service';
import { CafeteriaBookingController } from './cafeteria_booking.controller';
import { FloorDetailsModule } from '../floor_details/floor_details.module';
import { OverallBookingModule } from '../overall_booking/overall_booking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeteriaBooking } from './entities/cafeteria_booking.entity';

describe('CafeteriaBookingService', () => {
  let service: CafeteriaBookingService;
  let controller: CafeteriaBookingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CafeteriaBookingController],
      providers: [CafeteriaBookingService],
      imports: [FloorDetailsModule, OverallBookingModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          port: 5432,
          username: 'postgres',
          database: 'postgres-new',
          password: 'postgres'
        }),
        TypeOrmModule.forFeature([CafeteriaBooking]),
      ],
    }).compile();

    service = module.get<CafeteriaBookingService>(CafeteriaBookingService);
    controller = module.get<CafeteriaBookingController>(CafeteriaBookingController)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
