import { Injectable } from '@nestjs/common';
import { CreateFloorDetailDto } from './dto/create-floor_detail.dto';
import { UpdateFloorDetailDto } from './dto/update-floor_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FloorDetail } from './entities/floor_detail.entity';

@Injectable()
export class FloorDetailsService {

  constructor(
    @InjectRepository(FloorDetail) private readonly repo: Repository<FloorDetail>) {}

    //add floor details
  create(createFloorDetailDto: CreateFloorDetailDto) {
    const floorDetail = this.repo.create(createFloorDetailDto);
    return this.repo.save(floorDetail);
  }

  //get all floor details except cafeteria floor
  findAll() {
    let n=0
    let f=this.repo.createQueryBuilder('floor')
    .where('floor.no_meeting_rooms != :n', {n})
    .getMany()
    return f
  }

  findOne(id: number) {
    return this.repo.findOne({where: {floor_number: id}});
  }

  update(id: number, updateFloorDetailDto: UpdateFloorDetailDto) {
    return `This action updates a #${id} floorDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} floorDetail`;
  }

  //find total capacity of all floors except cafeteria
  async findTotalCapacity(){
    const n=0
    const sum = await this.repo.createQueryBuilder('floor_detail')
      .where('floor_detail.no_meeting_rooms != :n', {n})
      .select('SUM(floor_detail.capacity)', 'sum')
      .getRawOne();
    return sum.sum;
  }

  //get floor details
  async getFloorDet(id: number){
    return this.repo.find({where: {floor_number: id}})
  }
}
