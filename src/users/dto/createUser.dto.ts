import CreateAddressDto from './createAddress.dto';

class CreateUserDto {
  email: string;
  name: string;
  password: string;
  address?: CreateAddressDto;
}

export default CreateUserDto;
