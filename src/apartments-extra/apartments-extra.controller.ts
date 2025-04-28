import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApartmentsExtraService } from './apartments-extra.service';
import { CreateApartmentsExtraDto, UpdateApartmentsExtraDto } from './dto';

@Controller('apartments-extra')
export class ApartmentsExtraController {
  constructor(
    private readonly apartmentsExtraService: ApartmentsExtraService,
  ) {}

  @Post()
  create(@Body() body: CreateApartmentsExtraDto) {
    return this.apartmentsExtraService.createApartmentExtra(body);
  }

  @Get()
  findAll() {
    return this.apartmentsExtraService.findAllApartmentExtra();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentsExtraService.findOneApartmentExtra(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateApartmentsExtraDto) {
    return this.apartmentsExtraService.updateApartmentExtra(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apartmentsExtraService.removeApartmentExtra(+id);
  }
}
