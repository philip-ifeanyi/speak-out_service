import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Response } from '../../responses/entities/response.entity';
import { GrievanceStatus } from '../enums/grievance-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Grievance {
  @PrimaryGeneratedColumn('uuid', { name: 'grievance_id' })
  id: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column({
    type: 'enum',
    enum: GrievanceStatus,
    default: GrievanceStatus.DRAFT,
  })
  status: GrievanceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.grievances)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Response, (response) => response.grievance)
  response: Response;
}
