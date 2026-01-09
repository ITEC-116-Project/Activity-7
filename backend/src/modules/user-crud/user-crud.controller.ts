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
import { UserCrudService } from "./user-crud.service";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@ApiTags("Users")
@Controller("user-crud")
export class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}

  @Get()
  @ApiOperation({ summary: "List all users" })
  findAll() {
    return this.userCrudService.findAll(); // fetch all users
  }

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  create(@Body() body: CreateUserDto) {
    return this.userCrudService.create(body);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update an existing user" })
  update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.userCrudService.update(Number(id), body);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  remove(@Param("id") id: string) {
    return this.userCrudService.remove(Number(id));
  }
}
