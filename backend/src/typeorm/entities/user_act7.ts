import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

export enum Role {
  MANAGER = "manager",
  MEMBER = "member",
}

export enum Department {
  ADMIN = "Admin",
  HR = "HR",
  IT = "IT",
  SALES = "Sales",
  FINANCE = "Finance",
}

@Entity({ name: "user_act7" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  companyId?: string;

  @Column({ type: "enum", enum: Role, default: Role.MEMBER })
  role: Role;

  @Column({ type: "enum", enum: Department, nullable: true })
  department?: Department;

  @CreateDateColumn()
  createdAt: Date;
}
