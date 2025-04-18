import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), UserModule,],
    providers: [NotificationService],
    controllers: [NotificationController],
    exports: [NotificationService]
})
export class NotificationModule { }
