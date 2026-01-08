import { Repository } from "typeorm";
import { User } from "../../typeorm/entities/user_act7";
export declare class UserCrudService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    create(data: Partial<User>): Promise<User[]>;
    update(id: number, data: Partial<User>): Promise<User | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
