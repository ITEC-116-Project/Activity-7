import { UserCrudService } from "./user-crud.service";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
export declare class UserCrudController {
    private readonly userCrudService;
    constructor(userCrudService: UserCrudService);
    findAll(): Promise<import("../../typeorm/entities/user_act7").User[]>;
    create(body: CreateUserDto): Promise<any>;
    update(id: string, body: UpdateUserDto): Promise<any>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
