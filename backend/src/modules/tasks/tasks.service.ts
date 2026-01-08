import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../../typeorm/entities/tasks.js";
import { User } from "../../typeorm/entities/user_act7.js";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  create(data: Partial<Task>) {
    // only managers can create/assign tasks - require creatorId
    const creatorId = (data as any).creatorId;
    if (!creatorId) throw new BadRequestException("creatorId required");
    const check = this.userRepository
      .findOne({ where: { id: creatorId } as any })
      .then((u) => {
        if (!u) throw new BadRequestException("creator not found");
        if (u.role !== "manager")
          throw new UnauthorizedException("only managers can create tasks");
      });

    // allow passing projectId and assignedToId
    if ((data as any).projectId) {
      (data as any).project = { id: (data as any).projectId };
      delete (data as any).projectId;
    }
    if ((data as any).assignedToId) {
      (data as any).assignedTo = { id: (data as any).assignedToId };
      delete (data as any).assignedToId;
    }
    const t = this.taskRepository.create(data as any);
    return check.then(() => this.taskRepository.save(t));
  }

  async update(id: number, data: Partial<Task>) {
    if ((data as any).projectId) {
      (data as any).project = { id: (data as any).projectId };
      delete (data as any).projectId;
    }
    if ((data as any).assignedToId) {
      (data as any).assignedTo = { id: (data as any).assignedToId };
      delete (data as any).assignedToId;
    }
    await this.taskRepository.update(id, data as any);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
