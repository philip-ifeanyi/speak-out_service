import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGrievanceDto } from './dto/create-grievance.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { GrievanceListFilterDto } from './dto/grievance-list-filter.dto';
import { UpdateGrievanceStatusDto } from './dto/update-grievance-status.dto';

@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createGrievanceDto: CreateGrievanceDto,
    @RequestUser() user: User,
  ) {
    const data = await this.grievancesService.create(
      createGrievanceDto,
      user.id,
    );

    return { message: 'Grievance created successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':grievanceId')
  async findOne(
    @Param('grievanceId') grievanceId: string,
    @RequestUser() user: User,
  ) {
    const data = await this.grievancesService.findOne(grievanceId, true);

    return { message: 'Grievance fetched successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() grievanceListFilterDto: GrievanceListFilterDto,
    @RequestUser() user: User,
  ) {
    const data = await this.grievancesService.findAll(
      grievanceListFilterDto,
      user,
    );

    return { message: 'Grievances fetched successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':grievanceId')
  async updateStatus(
    @Param('grievanceId') grievanceId: string,
    @Body() updateGrievanceStatusDto: UpdateGrievanceStatusDto,
    @RequestUser() user: User,
  ) {
    const data = await this.grievancesService.updateStatus(
      grievanceId,
      updateGrievanceStatusDto,
      user,
    );

    return { message: 'Grievance status updated successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':grievanceId')
  async remove(
    @Param('grievanceId') grievanceId: string,
    @RequestUser() user: User,
  ) {
    await this.grievancesService.remove(grievanceId, user);

    return { message: 'Grievance deleted successfully' };
  }
}
