import {IsEnum, IsNotEmpty} from "class-validator";
import {GrievanceStatus} from "../enums/grievance-status.enum";

export class GrievanceListFilterDto {
    @IsEnum(GrievanceStatus)
    @IsNotEmpty()
    status: GrievanceStatus;
}