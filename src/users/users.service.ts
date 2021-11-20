import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import LocalFileDto from 'src/localFiles/dto/localFile.dto';
import LocalFilesService from 'src/localFiles/localFiles.service';
import UpdateUserDto from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private localFilesService: LocalFilesService,
  ) {}

  async getByEmail(email: string) {
    const user = this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async setCurrentRefreshToken(
    currentHashedRefreshToken: string,
    userId: number,
  ) {
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async create(user: CreateUserDto) {
    const newUser = await this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async addAvatar(userId: number, fileData: LocalFileDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(userId, updateUserDto);
    return this.usersRepository.findOne(userId);
  }
}
