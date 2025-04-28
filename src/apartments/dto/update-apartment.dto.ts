import { PartialType } from '@nestjs/mapped-types';
import { CreateApartmentDto } from './create-apartment.dto';
// import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateApartmentDto extends PartialType(CreateApartmentDto) {
  // @IsEnum(['corporate', 'tourist'])
  // @IsNotEmpty()
  // apartment_type: 'corporate' | 'tourist';
}
