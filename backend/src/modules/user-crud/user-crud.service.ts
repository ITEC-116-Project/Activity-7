import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../typeorm/entities/user_act7";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Injectable()
export class UserCrudService {
  constructor(
    @InjectRepository(User) // Inject the repository for User entity
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find(); // fetch all users from DB
  }

  async create(data: CreateUserDto) {
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    const u = this.userRepository.create(data as any);
    const saved = await this.userRepository.save(u);
    // avoid leaking hashed password
    const { password, ...rest } = saved as any;
    return rest;
  }

  async update(id: number, data: UpdateUserDto) {
    if (!Object.keys(data || {}).length) {
      throw new BadRequestException("At least one field must be provided");
    }
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    const user = await this.userRepository.preload({ id, ...data } as any);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const saved = await this.userRepository.save(user);
    const { password, ...rest } = saved as any;
    return rest;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { deleted: true };
  }
}
