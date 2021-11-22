import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsEnum, IsOptional } from 'class-validator';
import Permission from '../permission.type';
import Role from '../role.enum';

export default class UpdateUserDto {
  @ApiProperty({ isArray: true, enum: Role })
  @IsOptional()
  @ArrayUnique()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @ApiProperty({ isArray: true, enum: Permission })
  @IsOptional()
  @ArrayUnique()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
