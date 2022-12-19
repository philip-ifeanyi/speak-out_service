import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grievance } from './entities/grievance.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateGrievanceDto } from './dto/create-grievance.dto';
import { GrievanceStatus } from './enums/grievance-status.enum';
import { UpdateGrievanceStatusDto } from './dto/update-grievance-status.dto';
import * as assert from 'assert';
import { GrievanceListFilterDto } from './dto/grievance-list-filter.dto';

@Injectable()
export class GrievancesService {
  constructor(
    @InjectRepository(Grievance)
    private readonly grievanceRepository: Repository<Grievance>,
    private readonly usersService: UsersService,
  ) {}

  async create(createGrievanceDto: CreateGrievanceDto, userId: string) {
    const user: User = await this.usersService.findOne(userId, true);

    return this.grievanceRepository.save({
      ...createGrievanceDto,
      status: createGrievanceDto.isDraft
        ? GrievanceStatus.DRAFT
        : GrievanceStatus.SENT,
      user,
    });
  }

  async findAll({ status }: GrievanceListFilterDto, user: User) {
    if (user.isAdmin) {
      let filter: Record<string, any> = { status };
      filter =
        status === GrievanceStatus.PENDING
          ? { admin: user, ...filter }
          : filter;

      return this.grievanceRepository.find({ where: filter });
    }

    return this.grievanceRepository.find({ where: { user, status } });
  }

  async findOne(grievanceId: string, throwIfNotFound: boolean) {
    return this.grievanceRepository
      .findOne({ where: { id: grievanceId }, relations: ['user'] })
      .then((grievance) => {
        if (throwIfNotFound && !grievance)
          throw new NotFoundException('Grievance Not Found');
        return grievance;
      });
  }

  async updateStatus(
    grievanceId: string,
    updateGrievanceStatusDto: UpdateGrievanceStatusDto,
    user: User,
  ) {
    const grievance = await this.findOne(grievanceId, true);

    if (
      [GrievanceStatus.PENDING, GrievanceStatus.SOLVED].includes(
        updateGrievanceStatusDto.status,
      )
    ) {
      if (!user.isAdmin) throw new ForbiddenException();
    } else {
      if (grievance.user.id !== user.id) throw new ForbiddenException();
    }

    try {
      switch (updateGrievanceStatusDto.status) {
        case GrievanceStatus.DELETED:
          assert(grievance.status === GrievanceStatus.DRAFT);
          break;
        case GrievanceStatus.DRAFT:
          assert(grievance.status === GrievanceStatus.DELETED);
          break;
        case GrievanceStatus.SENT:
          assert(grievance.status === GrievanceStatus.DRAFT);
          break;
        case GrievanceStatus.PENDING:
          assert(grievance.status === GrievanceStatus.SENT);
          break;
        case GrievanceStatus.SOLVED:
          assert(grievance.status === GrievanceStatus.PENDING);
          break;
      }
    } catch (error) {
      throw new BadRequestException(
        'Wrong update option for current grievance status',
      );
    }
    grievance.status = updateGrievanceStatusDto.status;

    return this.grievanceRepository.save(grievance);
  }

  async remove(grievanceId: string, { id: userId }: User) {
    const user = await this.usersService.findOne(userId, true);

    await this.grievanceRepository.delete({ id: grievanceId, user });
  }
}
