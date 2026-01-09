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
import { ProjectsService } from "./projects.service.js";
import { CreateProjectDto } from "./dto/create-project.dto.js";
import { UpdateProjectDto } from "./dto/update-project.dto.js";

@ApiTags("Projects")
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: "List all projects" })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Fetch a single project by id" })
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: "Create a new project" })
  create(@Body() body: CreateProjectDto) {
    return this.projectsService.create(body as any);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an existing project" })
  update(@Param("id") id: string, @Body() body: UpdateProjectDto) {
    return this.projectsService.update(Number(id), body as any);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a project" })
  remove(@Param("id") id: string) {
    return this.projectsService.remove(Number(id));
  }
}
