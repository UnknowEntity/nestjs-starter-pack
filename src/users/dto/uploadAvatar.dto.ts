import { ApiProperty } from '@nestjs/swagger';

export default class UploadAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
