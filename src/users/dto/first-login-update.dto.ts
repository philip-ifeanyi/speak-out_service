import { IsNotEmpty, IsString } from 'class-validator';

export class FirstLoginUpdateDto {
  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  matricOrStaffNumber: string;
}
