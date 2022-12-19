import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FirstLoginUpdateDto } from './dto/first-login-update.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.findByEmail(createUserDto.email).then((user) => {
      if (user) throw new ConflictException('User with email already exists');
    });

    createUserDto.password = await this.encryptPassword(createUserDto.password);

    return this.userRepository.save(createUserDto);
  }

  async updateOnFirstLogin(
    firstLoginUpdateDto: FirstLoginUpdateDto,
    { id }: User,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });

    user.department = firstLoginUpdateDto.department;
    user.matricOrStaffNumber = firstLoginUpdateDto.matricOrStaffNumber;

    return this.userRepository.save(user);
  }

  async encryptPassword(plainPassword: string): Promise<string> {
    const saltOrRounds = 10;

    return bcrypt.hash(plainPassword, saltOrRounds);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async verifyPassword(
    user: User,
    password: string,
    throwIfNotCorrect = false,
  ) {
    return bcrypt.compare(password, user.password).then((isCorrect) => {
      if (throwIfNotCorrect && !isCorrect)
        throw new BadRequestException('Invalid password');
      return isCorrect;
    });
  }

  async findOne(userId: string, throwIfNotFound: boolean) {
    return this.userRepository
      .findOne({ where: { id: userId } })
      .then((user) => {
        if (!user && throwIfNotFound)
          throw new NotFoundException('User Not Found');
        return user;
      });
  }

  async update(updateUserDto: UpdateUserDto, { id: userId }: User) {
    const user = await this.findOne(userId, true);

    if (updateUserDto.oldPassword) {
      await this.verifyPassword(user, updateUserDto.oldPassword, true);
      user.password = await this.encryptPassword(updateUserDto.newPassword);
    }
    if (updateUserDto.oldEmail) {
      await this.findByEmail(updateUserDto.newEmail).then((existingUser) => {
        if (existingUser?.id === user.id)
          throw new BadRequestException('Use a different email');
        if (existingUser) throw new ConflictException('Email already taken');
      });

      user.email = updateUserDto.newEmail;
    }

    user.getsEmailNotifications =
      updateUserDto.getsEmailNotifications === null
        ? user.getsEmailNotifications
        : updateUserDto.getsEmailNotifications;

    await this.userRepository.save(user);
  }

  async remove(user: User) {
    await this.userRepository.remove(user);
  }
}
