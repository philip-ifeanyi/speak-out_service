import { GrievanceStatus } from '../enums/grievance-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateGrievanceStatusDto {
  @IsEnum(GrievanceStatus)
  @IsNotEmpty()
  status: GrievanceStatus;
}
