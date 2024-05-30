import { User } from '../users/users.entity';

import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TalentCards {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column()
  description: string;

  @Column('text', { array: true, nullable: true })
  skills: string[];

  @IsNumber()
  @Column()
  price: number;

  @Column('text', { array: true, nullable: true })
  portfolio: string[];

  @ManyToOne(() => User, (user) => user.talentCards, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
