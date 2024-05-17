import { User } from '../users/users.entity';

import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('text', { array: true })
  skills: string[];

  @IsNumber()
  @Column()
  pay: number;

  @ManyToOne(() => User, (user) => user.talentCards, { onDelete: 'CASCADE' })
  user: User;
}
