/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const userEmail = createUserDto.email;
    const isUserExist = await this.usersRepository.exists({
      where: {
        email: userEmail
      }
    });
    if (isUserExist) {
      throw new BadRequestException('User already exist.');
    };

    createUserDto.password = await bcrypt.hash(createUserDto.password, saltRounds);
    return await this.usersRepository.save(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const userEmail = loginUserDto.email;
    const user = await this.usersRepository.findOneBy({
      email: userEmail
    });
    if (!user) {
      throw new BadRequestException('User may not exist or invalid credentials.');
    };

    if (!await bcrypt.compare(loginUserDto.password, user.password)) {
      throw new BadRequestException('Incorrect password.');
    }

    const message = 'Login successful.';
    return { message };
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | any> {
    await this.usersRepository.update(id, updateUserDto);
    return await this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.usersRepository.delete({});
  }
}
