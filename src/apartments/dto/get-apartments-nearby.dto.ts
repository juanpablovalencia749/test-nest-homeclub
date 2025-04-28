import { IsOptional, IsEnum, IsNumberString } from 'class-validator';

export class GetApartmentsNearbyDto {
  @IsNumberString()
  lat: string;

  @IsNumberString()
  lng: string;

  @IsOptional()
  @IsEnum(['corporate', 'tourist'])
  type?: 'corporate' | 'tourist';

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
