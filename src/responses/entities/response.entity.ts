import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grievance } from '../../grievances/entities/grievance.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Response {
  @PrimaryGeneratedColumn('uuid', { name: 'response_id' })
  id: string;

  @Column()
  response: string;

  @OneToOne(() => Grievance, (grievance) => grievance.response)
  @JoinColumn({ name: 'grievance_id' })
  grievance: Grievance;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin: User;
}
