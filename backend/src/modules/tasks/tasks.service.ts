import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../../typeorm/entities/tasks.js";
import { User } from "../../typeorm/entities/user_act7.js";
import { Project } from "../../typeorm/entities/projects.js";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  findAll() {
    return this.taskRepository.find({
      relations: ["project", "project.owner", "assignedTo"],
    });
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ["project", "project.owner", "assignedTo"],
    });
  }

  async create(data: Partial<Task>) {
    const payload = { ...data } as any;
    const creatorId = payload.creatorId;
    if (!creatorId) throw new BadRequestException("creatorId required");

    const creator = await this.userRepository.findOne({
      where: { id: creatorId } as any,
    });
    if (!creator) throw new BadRequestException("creator not found");
    if (creator.role !== "manager")
      throw new UnauthorizedException("only managers can create tasks");

    // resolve project and assigned user if provided
    if (payload.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: payload.projectId } as any,
      });
      if (!project) throw new BadRequestException("project not found");
      payload.project = project;
      delete payload.projectId;
    }
    if (payload.assignedToId) {
      const assignee = await this.userRepository.findOne({
        where: { id: payload.assignedToId } as any,
      });
      if (!assignee) throw new BadRequestException("assigned user not found");
      payload.assignedTo = assignee;
      delete payload.assignedToId;
    }

    const t = this.taskRepository.create(payload as any);
  const saved = await this.taskRepository.save(t);
  return this.findOne((saved as any).id);
  }

  async update(id: number, data: Partial<Task>) {
    const payload = { ...data } as any;
    if (!Object.keys(payload || {}).length) {
      throw new BadRequestException("At least one field must be provided");
    }
    if (payload.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: payload.projectId } as any,
      });
      if (!project) throw new BadRequestException("project not found");
      payload.project = project;
      delete payload.projectId;
    }
    if (payload.assignedToId) {
      const assignee = await this.userRepository.findOne({
        where: { id: payload.assignedToId } as any,
      });
      if (!assignee) throw new BadRequestException("assigned user not found");
      payload.assignedTo = assignee;
      delete payload.assignedToId;
    }

    const task = await this.taskRepository.preload({ id, ...payload } as any);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    const saved = await this.taskRepository.save(task);
    return this.findOne(saved.id);
  }

  async remove(id: number) {
    const result = await this.taskRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Task with id ${id} not found`);
    return { deleted: true };
  }
}
