import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TasksService } from "./tasks.service.js";
import { CreateTaskDto } from "./dto/create-task.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";

@ApiTags("Tasks")
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: "List all tasks" })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Fetch a task by id" })
  findOne(@Param("id") id: string) {
    return this.tasksService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: "Create a new task" })
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body as any);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an existing task" })
  update(@Param("id") id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(Number(id), body as any);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a task" })
  remove(@Param("id") id: string) {
    return this.tasksService.remove(Number(id));
  }
}
