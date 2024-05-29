import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class TalentStatistics {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.talentStatistics)
  @JoinColumn()
  user: User;

  @Column({ default: 0 })
  earnings: number;

  @Column({ default: 0 })
  jobSuccess: number;

  @Column({ default: 0 })
  jobsTaken: number;
}
