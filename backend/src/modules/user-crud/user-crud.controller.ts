import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { UserCrudService } from "./user-crud.service";

@Controller("user-crud")
export class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}

  @Get()
  findAll() {
    return this.userCrudService.findAll(); // fetch all users
  }

  @Post()
  create(@Body() body: any) {
    return this.userCrudService.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.userCrudService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userCrudService.remove(Number(id));
  }
}
