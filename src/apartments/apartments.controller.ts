import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import {
  CreateApartmentDto,
  UpdateApartmentDto,
  GetApartmentsNearbyDto,
} from './dto';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentService: ApartmentsService) {}

  @Get('nearby')
  findAllNearby(@Query() query: GetApartmentsNearbyDto) {
    return this.apartmentService.findAllNearbyApartments(query);
  }

  @Get()
  findAll() {
    return this.apartmentService.findAllApartments();
  }

  @Post('create')
  create(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentService.createApartment(createApartmentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentService.findOneApartment(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
  ) {
    return this.apartmentService.updateApartment(id, updateApartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apartmentService.removeApartment(id);
  }
}
