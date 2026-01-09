import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Username chosen during signup" })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "Password for the account" })
  @IsNotEmpty()
  password: string;
}
