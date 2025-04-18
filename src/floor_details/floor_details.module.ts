import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorDetailsService } from './floor_details.service';
import { FloorDetailsController } from './floor_details.controller';
import { FloorDetail } from './entities/floor_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FloorDetail])],
  controllers: [FloorDetailsController],
  providers: [FloorDetailsService],
  exports: [FloorDetailsService]
})
export class FloorDetailsModule {}
