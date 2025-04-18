import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { FloorDetailsService } from './floor_details.service';
import { CreateFloorDetailDto } from './dto/create-floor_detail.dto';
import { UpdateFloorDetailDto } from './dto/update-floor_detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AccessTokenGuard } from '../auth/access-token-guard';
import { Role } from 'src/role/model/role.enum';

@ApiTags('Floor Details')
@ApiBearerAuth('access-token')
@Controller('floor-details')
export class FloorDetailsController {
  constructor(private readonly floorDetailsService: FloorDetailsService) {}

  @Post()
  create(@Body() createFloorDetailDto: CreateFloorDetailDto) {
    return this.floorDetailsService.create(createFloorDetailDto);
  }

  @Get()  
  @UseGuards(AccessTokenGuard)
  // @SetMetadata('roles', ['admin'])
  // @UseGuards(RolesGuard)
  findAll(@Req() req: any) {
    return this.floorDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floorDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFloorDetailDto: UpdateFloorDetailDto) {
    return this.floorDetailsService.update(+id, updateFloorDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floorDetailsService.remove(+id);
  }

  @Get('floors/capacity')
  getTotalCapacity(){
    return this.floorDetailsService.findTotalCapacity()
  }
}
