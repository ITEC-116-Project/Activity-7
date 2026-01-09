import { PartialType } from "@nestjs/mapped-types";
import { CreateProjectDto } from "./create-project.dto.js";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ProjectStatus } from "../../../typeorm/entities/projects.js";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({ enum: ProjectStatus })
  status?: ProjectStatus;
}
