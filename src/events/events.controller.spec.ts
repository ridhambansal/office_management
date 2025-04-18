import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          port: 5432,
          username: 'postgres',
          database: 'postgres',
          password: 'postgres'
        }),
        TypeOrmModule.forFeature([Event]),
      ],
      controllers: [EventsController],
      providers: [EventsService],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEvents', () => {
    it('should return all events', async () => {

      const events = [
        { id: 1, event_name: 'Event 1', date: new Date(), description: 'Event 1 description' },
        { id: 2, event_name: 'Event 2', date: new Date(), description: 'Event 2 description' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(events);
      const result = await controller.findAll();
      expect(result).toEqual(events);
    });

    it('should return events by date', async () => {
      jest.spyOn(service, 'findByDate').mockResolvedValue([]);
      const result = await controller.findOne();
      expect(result).toEqual([]);
    });

    
  });
});

