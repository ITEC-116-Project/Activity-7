import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../typeorm/entities/user_act7.js";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(data: Partial<User>) {
    if (
      !data.password ||
      !data.name ||
      !data.username ||
      !data.companyId ||
      !data.email
    ) {
      throw new BadRequestException(
        "name, username, companyId, email and password are required",
      );
    }
    // username uniqueness
    const existingUsername = await this.userRepository.findOne({
      where: { username: data.username } as any,
    });
    if (existingUsername)
      throw new ConflictException("username already exists");
    // email must be unique
    const existingEmail = await this.userRepository.findOne({
      where: { email: data.email } as any,
    });
    if (existingEmail) throw new ConflictException("email already exists");

    // determine role based on companyId prefix
    const cid = String(data.companyId || "");
    const year = new Date().getFullYear().toString();
    let role: User["role"] = "member" as any;
    if (cid.startsWith("0")) {
      role = "manager" as any;
    } else if (cid.startsWith(year) && cid.length > year.length) {
      // must not be the bare year (e.g., '2026') — require additional digits
      role = "member" as any;
    } else {
      throw new BadRequestException(
        "Invalid ID. Please use a valid company ID.",
      );
    }
    const hash = await bcrypt.hash(data.password, 10);
    const u = this.userRepository.create({
      ...data,
      password: hash,
      role,
    } as any);
    const saved = await this.userRepository.save(u);
    // remove password before return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p, ...rest } = saved as any;
    return rest;
  }

  async login(email: string, password: string) {
    if (!email || !password)
      throw new BadRequestException("username and password required");
    const user = await this.userRepository.findOne({
      where: { username: email } as any,
    });
    if (!user) throw new UnauthorizedException("invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("invalid credentials");
    const { password: _p, ...rest } = user as any;
    return rest;
  }

  async updateProfile(
    id: number,
    data: Partial<{
      name?: string;
      email?: string;
      oldPassword?: string;
      newPassword?: string;
    }>,
  ) {
    const user = await this.userRepository.findOne({ where: { id } as any });
    if (!user) throw new BadRequestException("user not found");

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: data.email } as any,
      });
      if (existing) throw new ConflictException("email already exists");
      user.email = data.email;
    }

    if (data.name) user.name = data.name;

    if (data.newPassword) {
      if (!data.oldPassword)
        throw new BadRequestException(
          "oldPassword required to set new password",
        );
      const ok = await bcrypt.compare(data.oldPassword, user.password);
      if (!ok) throw new UnauthorizedException("old password does not match");
      user.password = await bcrypt.hash(data.newPassword, 10);
    }

    const saved = await this.userRepository.save(user as any);
    const { password: _p2, ...rest } = saved;
    return rest;
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({ where: { id } as any });
    if (!user) throw new BadRequestException("user not found");
    const { password: _p, ...rest } = user as any;
    return rest;
  }
}
