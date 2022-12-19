import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Response } from '../../responses/entities/response.entity';
import { Exclude } from 'class-transformer';

export class Admin {
  @PrimaryGeneratedColumn('uuid', { name: 'admin_id' })
  id: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Response, (response) => response.admin)
  responses: Response[];
}
