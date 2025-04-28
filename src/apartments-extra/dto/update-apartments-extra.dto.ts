import { IsString, IsUrl, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateApartmentsExtraDto } from './create-apartments-extra.dto';

export class UpdateApartmentsExtraDto extends PartialType(
  CreateApartmentsExtraDto,
) {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;
}
