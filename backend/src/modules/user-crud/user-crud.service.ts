import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../typeorm/entities/user_act7";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserCrudService {
  constructor(
    @InjectRepository(User) // Inject the repository for User entity
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find(); // fetch all users from DB
  }

  create(data: Partial<User>) {
    // hash password if present
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    const u = this.userRepository.create(data as any);
    return this.userRepository.save(u);
  }

  async update(id: number, data: Partial<User>) {
    if (data.password) data.password = bcrypt.hashSync(data.password, 10);
    await this.userRepository.update(id, data as any);
    return this.userRepository.findOne({ where: { id } as any });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
