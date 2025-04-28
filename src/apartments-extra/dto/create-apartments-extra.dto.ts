import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class CreateApartmentsExtraDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  image_url: string;
}
