import { IsEmail, IsOptional, Matches, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  oldPassword?: string;

  @IsOptional()
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
  newPassword?: string;
}
