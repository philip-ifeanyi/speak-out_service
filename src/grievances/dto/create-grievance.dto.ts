import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGrievanceDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}
