import { UserCrudService } from "./user-crud.service";
export declare class UserCrudController {
    private readonly userCrudService;
    constructor(userCrudService: UserCrudService);
    findAll(): Promise<import("../../typeorm/entities/user_act7").User[]>;
    create(body: any): Promise<import("../../typeorm/entities/user_act7").User[]>;
    update(id: string, body: any): Promise<import("../../typeorm/entities/user_act7").User | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
