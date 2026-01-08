import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "../../typeorm/entities/projects.js";
import { Task } from "../../typeorm/entities/tasks.js";
import { User } from "../../typeorm/entities/user_act7.js";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.projectRepository.find({ relations: ["owner"] });
  }

  findOne(id: number) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ["owner"],
    });
  }

  async create(data: Partial<Project>) {
    const payload = { ...data } as any;
    const creatorId = payload.creatorId;
    if (!creatorId) throw new BadRequestException("creatorId required");

    const creator = await this.userRepository.findOne({
      where: { id: creatorId } as any,
    });
    if (!creator) throw new BadRequestException("creator not found");
    if (creator.role !== "manager")
      throw new UnauthorizedException("only managers can create projects");
    if (!creator.companyId)
      throw new BadRequestException(
        "creator must have a companyId before creating projects",
      );

    payload.owner = creator;
    payload.ownerId = creator.companyId;
    delete payload.creatorId;
    delete payload.ownerCompanyId;

    if (payload.startDate) {
      const s = new Date(payload.startDate);
      const now = new Date();
      if (s < now)
        throw new BadRequestException("startDate cannot be in the past");
      if (payload.endDate) {
        const e = new Date(payload.endDate);
        if (e < s)
          throw new BadRequestException("endDate cannot be before startDate");
      }
    }
    const p = this.projectRepository.create(payload);
    return this.projectRepository.save(p);
  }

  async update(id: number, data: Partial<Project>) {
    const payload = { ...data } as any;

    if (payload.ownerId) {
      const owner = await this.userRepository.findOne({
        where: { companyId: payload.ownerId } as any,
      });
      if (!owner)
        throw new BadRequestException(
          "owner with provided companyId not found",
        );
      payload.ownerId = owner.companyId;
    }
    // Validate dates on update as well
    if (payload.startDate) {
      const s = new Date(payload.startDate);
      const now = new Date();
      if (s < now)
        throw new BadRequestException("startDate cannot be in the past");
      if (payload.endDate) {
        const e = new Date(payload.endDate);
        if (e < s)
          throw new BadRequestException("endDate cannot be before startDate");
      }
    }
    if ("creatorId" in payload) delete payload.creatorId;
    if ("owner" in payload) delete payload.owner;
    await this.projectRepository.update(id, payload);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.taskRepository
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where("projectId = :id", { id })
      .execute();
    return this.projectRepository.delete(id);
  }
}
