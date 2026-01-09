import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Department } from "../../../typeorm/entities/user_act7.js";

export class SignupDto {
  @ApiProperty({ description: "Full name of the user" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Email address used for login and notifications" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Unique username for authentication" })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "Company identifier used to infer the role" })
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({
    description:
      "Password that meets complexity requirements (upper, lower, number, symbol)",
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, {
    message: "password must contain a lowercase letter",
  })
  @Matches(/(?=.*[A-Z])/, {
    message: "password must contain an uppercase letter",
  })
  @Matches(/(?=.*\d)/, { message: "password must contain a number" })
  @Matches(/(?=.*[^A-Za-z0-9])/, {
    message: "password must contain a special character",
  })
  password: string;

  @ApiPropertyOptional({
    description: "Optional department for the user",
    enum: Department,
  })
  @IsOptional()
  @IsIn(Object.values(Department))
  department?: Department;
}
