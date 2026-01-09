import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksService } from "./tasks.service.js";
import { TasksController } from "./tasks.controller.js";
import { Task } from "../../typeorm/entities/tasks.js";
import { Project } from "../../typeorm/entities/projects.js";
import { User } from "../../typeorm/entities/user_act7.js";

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Project])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
