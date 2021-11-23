import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class UpdateCategoryDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
