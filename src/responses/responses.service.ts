import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from './entities/response.entity';
import { Repository } from 'typeorm';
import { CreateResponseDto } from './dto/create-response.dto';
import { User } from '../users/entities/user.entity';
import { GrievancesService } from '../grievances/grievances.service';
import { GrievanceStatus } from '../grievances/enums/grievance-status.enum';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    private readonly grievancesService: GrievancesService,
  ) {}

  async createResponse(createResponseDto: CreateResponseDto, user: User) {
    if (!user.isAdmin)
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );

    const grievance = await this.grievancesService.findOne(
      createResponseDto.grievanceId,
      true,
    );

    await this.grievancesService.updateStatus(
      grievance.id,
      { status: GrievanceStatus.SOLVED },
      user,
    );

    await this.responseRepository.create({
      ...createResponseDto,
      admin: user,
      grievance,
    });
  }
}
