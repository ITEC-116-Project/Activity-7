import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { TasksService } from "./tasks.service.js";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tasksService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.tasksService.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.tasksService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(Number(id));
  }
}
