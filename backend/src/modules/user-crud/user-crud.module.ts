import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserCrudService } from "./user-crud.service.js";
import { UserCrudController } from "./user-crud.controller.js";
import { User } from "../../typeorm/entities/user_act7";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Make repository available for injection
  ],
  controllers: [UserCrudController],
  providers: [UserCrudService],
})
export class UserCrudModule {}
