import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsIn,
  IsOptional,
} from "class-validator";
import { Department } from "../../../typeorm/entities/user_act7.js";

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  companyId: string;

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

  @IsOptional()
  @IsIn(Object.values(Department))
  department?: Department;
}
