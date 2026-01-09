import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto.js";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { TaskStatus } from "../../../typeorm/entities/tasks.js";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ enum: TaskStatus })
  status?: TaskStatus;
}
