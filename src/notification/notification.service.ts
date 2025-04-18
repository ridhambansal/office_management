import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import * as firebase from 'firebase-admin';
import { UserService } from 'src/user/user.service';

firebase.initializeApp({
  credential: firebase.credential.cert(
    'src/firebase-admin/firebase-admin.json',
  ),
});
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async createNotification(
    time: Date,
    title: string,
    message: string,
    token: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({ time, title, message, token });
    return this.notificationRepository.save(notification);
  }

  @Cron(CronExpression.EVERY_SECOND)
  async sendNotifications() {
    const notifications = await this.notificationRepository.find({
      order: { time: 'ASC' },
    });
    if (notifications.length > 0) {
      const currentTime = new Date();
      const firstNotification = notifications[0];

      if (currentTime >= new Date(firstNotification.time)) {
        // Send notification to user
        await firebase
          .messaging()
          .send({
            notification: {
              title: firstNotification.title,
              body: firstNotification.message,
            },
            token: firstNotification.token,
            android: { priority: 'high' },
          })
          .catch((error: any) => {
            console.error(error);
          });
        // Delete the first notification from the database
        await this.notificationRepository.delete(firstNotification.id);
      }
    }
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({ order: { time: 'ASC' } });
  }
  async findByToken(token: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { token },
      order: { time: 'ASC' },
    });
  }

  async sendNotificationToAllUsers(
    title: string,
    message: string,
  ): Promise<void> {
    const user = await this.userService.findAll();

    const messaging = firebase.messaging();

    const tokens = user.map((oneUser) => oneUser.firebaseToken);

    const notificationPayload: firebase.messaging.NotificationMessagePayload = {
      title,
      body: message,
    };

    const messagea: firebase.messaging.MulticastMessage = {
      notification: notificationPayload,
      tokens,
      android: {
        priority: 'high',
      },
    };

    await messaging.sendEachForMulticast(messagea).catch((error: any) => {
      console.error(error);
    });
  }
}
