import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsEnum, IsDateString } from "class-validator";
import { TaskStatus } from "../../../typeorm/entities/tasks.js";

export class CreateTaskDto {
  @ApiProperty({ description: "Short title for the task" })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: "Task description" })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Id of the user creating the task (must be a manager)" })
  @IsNotEmpty()
  creatorId: number | string;

  @ApiPropertyOptional({ description: "Project id this task belongs to" })
  @IsOptional()
  projectId?: number | string;

  @ApiPropertyOptional({ description: "Id of the user assigned to the task" })
  @IsOptional()
  assignedToId?: number | string;

  @ApiPropertyOptional({ description: "Deadline for the task (ISO date)" })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
