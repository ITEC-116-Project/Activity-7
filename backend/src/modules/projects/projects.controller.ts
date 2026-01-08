import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service.js";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.projectsService.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.projectsService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(Number(id));
  }
}
