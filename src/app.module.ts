import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import typeorm from './config/typeorm';
import { EventsModule } from './events/events.module';
import { typeOrmConfigProvider } from './config/typeorm';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { FloorDetailsModule } from './floor_details/floor_details.module';
import { SeatBookingModule } from './seat_booking/seat_booking.module';
import { OverallBookingModule } from './overall_booking/overall_booking.module';
import { CafeteriaBookingModule } from './cafeteria_booking/cafeteria_booking.module';
import { MeetingroomDetailsModule } from './meetingroom_details/meetingroom_details.module';
import { MeetingroomBookingModule } from './meetingroom_booking/meetingroom_booking.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationModule, EventsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfigProvider]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const typeormOptions = configService.get('typeorm');
        if (!typeormOptions) {
          throw new Error('TypeORM options not found');
        }
        return typeormOptions;
      }
    }),
    UserModule,
    RoleModule,
    FloorDetailsModule,
    SeatBookingModule,
    OverallBookingModule,
    CafeteriaBookingModule,
    MeetingroomDetailsModule,
    MeetingroomBookingModule,
    AuthModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }