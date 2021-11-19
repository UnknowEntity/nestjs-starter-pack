import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Address from './address.entity';
import CreateUserDto from './dto/createUser.dto';
import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async getByEmail(email: string) {
    const user = this.usersRepository.findOne(
      { email },
      { relations: ['address'] },
    );
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // async create({ address, ...user }: CreateUserDto) {
  //   if (address === undefined) {
  //     const newUser = await this.usersRepository.create(user);
  //     await this.usersRepository.save(newUser);
  //     return newUser;
  //   }
  //   const newAddress = await this.addressRepository.create(address);
  //   this.addressRepository.save(newAddress);
  //   const newUser = await this.usersRepository.create({
  //     ...user,
  //     address: newAddress,
  //   });
  //   await this.usersRepository.save(newUser);
  //   return newUser;
  // }

  async create(user: CreateUserDto) {
    const newUser = await this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne(
      { id },
      { relations: ['address'] },
    );
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
