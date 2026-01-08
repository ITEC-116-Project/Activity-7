import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./user_act7.js";

export enum ProjectStatus {
  PLANNED = "planned",
  ACTIVE = "active",
  COMPLETED = "completed",
}

@Entity({ name: "projects_act7" })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @Column({ name: "ownerId", nullable: true })
  ownerId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "ownerId", referencedColumnName: "companyId" })
  owner?: User;

  @Column({ nullable: true, type: "datetime" })
  startDate?: Date;

  @Column({ nullable: true, type: "datetime" })
  endDate?: Date;

  @Column({ default: ProjectStatus.PLANNED })
  status: ProjectStatus;

  @CreateDateColumn()
  createdAt: Date;
}
