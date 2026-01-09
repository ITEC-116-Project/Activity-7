import { Controller, Post, Body, Patch, Param, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service.js";
import { SignupDto } from "./dto/signup.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({ summary: "Register a new user account" })
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post("login")
  @ApiOperation({ summary: "Authenticate a user by username and password" })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body.username, body.password);
    return user;
  }

  @Get("profile/:id")
  @ApiOperation({ summary: "Retrieve a user profile by id" })
  async getProfile(@Param("id") id: string) {
    return this.authService.getProfile(Number(id));
  }

  @Patch("profile/:id")
  @ApiOperation({ summary: "Update profile details and optionally change password" })
  async updateProfile(@Param("id") id: string, @Body() body: UpdateProfileDto) {
    return this.authService.updateProfile(Number(id), body as any);
  }
}
