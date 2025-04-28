import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateApartmentDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  type: string;

  @IsEnum(['corporate', 'tourist'])
  apartment_type?: 'corporate' | 'tourist';

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  status: string;
}
