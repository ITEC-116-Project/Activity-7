import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto.js";
import { Department, Role } from "../../../typeorm/entities/user_act7.js";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ enum: Role, description: "Role to assign" })
  role?: Role;

  @ApiPropertyOptional({ enum: Department, description: "Department of the user" })
  department?: Department;
}
