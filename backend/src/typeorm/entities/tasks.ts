import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Project } from "./projects.js";
import { User } from "./user_act7.js";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

@Entity({ name: "tasks_act7" })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @ManyToOne(() => Project, { nullable: true })
  project?: Project;

  @ManyToOne(() => User, { nullable: true })
  assignedTo?: User;

  @Column({ nullable: true, type: "datetime" })
  deadline?: Date;

  @Column({ default: TaskStatus.PENDING })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;
}
