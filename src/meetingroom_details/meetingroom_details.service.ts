// src/meetingroom_details/meetingroom_details.service.ts

import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MeetingroomDetail } from './entities/meetingroom_detail.entity';
import { CreateMeetingroomDetailDto } from './dto/create-meetingroom_detail.dto';
import { UpdateMeetingroomDetailDto } from './dto/update-meetingroom_detail.dto';
import { FloorDetail } from '../floor_details/entities/floor_detail.entity';

@Injectable()
export class MeetingroomDetailsService {
  constructor(
    @InjectRepository(MeetingroomDetail)
    private readonly repo: Repository<MeetingroomDetail>,

    @InjectRepository(FloorDetail)
    private readonly floorRepo: Repository<FloorDetail>,
  ) {}

  /** Create a new meeting room */
  async create(
    dto: CreateMeetingroomDetailDto,
  ): Promise<MeetingroomDetail> {
    const { room_name, capacity, floor_number } = dto;

    // 1️⃣ Validate
    if (!room_name || capacity == null || floor_number == null) {
      throw new BadRequestException(
        'room_name, capacity and floor_number are all required',
      );
    }

    // 2️⃣ Ensure floor exists
    const floor = await this.floorRepo.findOneBy({ floor_number });
    if (!floor) {
      throw new NotFoundException(
        `No FloorDetail found with floor_number ${floor_number}`,
      );
    }

    // 3️⃣ Build entity payload (use .room, not .roomName)
    const room = this.repo.create({
      room:     room_name,
      capacity,
      floor,
    });

    // 4️⃣ Save & handle dup‑key
    try {
      return await this.repo.save(room);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException(
          `A meeting room named "${room_name}" on floor ${floor_number} already exists`,
        );
      }
      throw new InternalServerErrorException(
        'Could not create meeting room',
      );
    }
  }

  /** Get all rooms (with floor relation) */
  findAll(): Promise<MeetingroomDetail[]> {
    return this.repo.find({ relations: ['floor'] });
  }

  /** Find one by PK */
  async findOne(id: number): Promise<MeetingroomDetail> {
    const room = await this.repo.findOne({
      where: { roomId: id },
      relations: ['floor'],
    });
    if (!room) {
      throw new NotFoundException(`Meeting room ${id} not found`);
    }
    return room;
  }

  /** Update name or capacity */
  async update(
    id: number,
    dto: UpdateMeetingroomDetailDto,
  ): Promise<MeetingroomDetail> {
    const room = await this.findOne(id);

    if (dto.room_name !== undefined) {
      room.room = dto.room_name;
    }
    if (dto.capacity !== undefined) {
      room.capacity = dto.capacity;
    }

    return this.repo.save(room);
  }

  /** Delete by PK */
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Meeting room ${id} not found`);
    }
    return { message: `Meeting room ${id} deleted successfully` };
  }

  /** Find rooms with at least the given capacity */
  getRoomByCapacity(capacity: number): Promise<MeetingroomDetail[]> {
    return this.repo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.floor', 'floor')
      .where('room.capacity >= :capacity', { capacity })
      .getMany();
  }

  /** List all rooms on a given floor */
  async getFloorRooms(
    floor_number: number,
  ): Promise<MeetingroomDetail[]> {
    const floor = await this.floorRepo.findOneBy({ floor_number });
    if (!floor) {
      throw new NotFoundException(
        `No FloorDetail found with floor_number ${floor_number}`,
      );
    }
    return this.repo.find({
      where: { floor: { floor_number } },
      relations: ['floor'],
    });
  }
}
