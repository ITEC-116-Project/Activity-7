import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from "class-validator";
import { Department, Role } from "../../../typeorm/entities/user_act7.js";

export class CreateUserDto {
  @ApiProperty({ description: "Full name of the user" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Username for authentication", minLength: 3 })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "Unique email address" })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Raw password to be hashed before storing",
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ description: "Company identifier" })
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({ enum: Role, description: "Role to assign" })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ enum: Department, description: "Department of the user" })
  @IsOptional()
  @IsEnum(Department)
  department?: Department;
}
