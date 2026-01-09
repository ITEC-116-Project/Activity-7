import { IsEmail, IsOptional, Matches, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: "Updated display name" })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: "Updated email address" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: "Current password required when changing password" })
  @IsOptional()
  oldPassword?: string;

  @ApiPropertyOptional({
    description:
      "New password that meets complexity requirements (upper, lower, number, symbol)",
    minLength: 8,
  })
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
