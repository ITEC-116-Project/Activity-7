import { Repository } from "typeorm";
import { User } from "../../typeorm/entities/user_act7";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
export declare class UserCrudService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    create(data: CreateUserDto): Promise<any>;
    update(id: number, data: UpdateUserDto): Promise<any>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
