import {IsNotEmpty, IsString, IsUUID} from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @IsNotEmpty()
  response: string;

  @IsUUID()
  @IsNotEmpty()
  grievanceId: string;
}
