import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @ValidateIf((dto) => !!dto.oldPassword)
  newPassword: string;

  @IsEmail()
  @IsOptional()
  oldEmail: string;

  @IsEmail()
  @ValidateIf((dto) => !!dto.oldEmail)
  newEmail: string;

  @IsBoolean()
  @IsOptional()
  getsEmailNotifications: boolean;
}
