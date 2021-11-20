import { ArrayUnique, IsEnum, IsOptional } from 'class-validator';
import Permission from '../permission.type';
import Role from '../role.enum';

export default class UpdateUserDto {
  @IsOptional()
  @ArrayUnique()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsOptional()
  @ArrayUnique()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
