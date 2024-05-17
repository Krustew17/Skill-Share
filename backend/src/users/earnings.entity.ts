import { User } from './users.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Earnings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, (user) => user.earnings)
  user: User;
}
