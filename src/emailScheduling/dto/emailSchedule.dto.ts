import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEmail } from 'class-validator';

export class EmailScheduleDto {
  @ApiProperty()
  @IsEmail()
  recipient: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsDateString()
  date: string;
}

export default EmailScheduleDto;
