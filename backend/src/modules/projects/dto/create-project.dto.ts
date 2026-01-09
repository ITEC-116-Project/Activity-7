import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsDateString, IsEnum } from "class-validator";
import { ProjectStatus } from "../../../typeorm/entities/projects.js";

export class CreateProjectDto {
  @ApiProperty({ description: "Project name" })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: "Project description" })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Company id of the creator (required to verify manager)" })
  @IsNotEmpty()
  creatorId: string | number;

  @ApiPropertyOptional({ description: "Project start date (ISO string)" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: "Project end date (ISO string)" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, description: "Optional initial status" })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
