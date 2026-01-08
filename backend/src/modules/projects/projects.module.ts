import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectsService } from "./projects.service.js";
import { ProjectsController } from "./projects.controller.js";
import { Project } from "../../typeorm/entities/projects";
import { Task } from "../../typeorm/entities/tasks.js";
import { User } from "../../typeorm/entities/user_act7.js";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
