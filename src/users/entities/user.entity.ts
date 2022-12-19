import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Grievance } from '../../grievances/entities/grievance.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  department: string;

  @Column({ name: 'matric_or_staff_number', nullable: true })
  matricOrStaffNumber: string;

  @Column({ name: 'gets_email_notifications', default: false })
  getsEmailNotifications: boolean;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @OneToMany(() => Grievance, (grievance) => grievance.user)
  grievances: Grievance[];
}
