// src/notification/notification.controller.ts
import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Your existing POST...
  @Post()
  createNotification(
    @Body('time') time: Date,
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('token') token: string,
  ): Promise<Notification> {
    return this.notificationService.createNotification(time, title, message, token);
  }

  // GET all notifications
  @Get()
  async getAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  // GET notifications by user token
  @Get(':token')
  async getByToken(@Param('token') token: string): Promise<Notification[]> {
    const notifs = await this.notificationService.findByToken(token);
    if (!notifs.length) {
      throw new HttpException('No notifications found for this token', HttpStatus.NOT_FOUND);
    }
    return notifs;
  }
}
