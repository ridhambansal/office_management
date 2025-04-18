import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('EventsService', () => {
  let controller: EventsController
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

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
