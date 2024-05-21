import { Job } from 'src/jobs/jobs.entity';
import { TalentCards } from '../talent/talentcards.entity';
import { Earnings } from './earnings.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_online_at', nullable: true })
  lastOnlineAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Job, (job) => job.user, { cascade: true })
  jobOffers: Job[];

  @OneToMany(() => TalentCards, (talent) => talent.user, { cascade: true })
  talentCards: TalentCards[];

  @OneToMany(() => Earnings, (earnings) => earnings.user, { cascade: true })
  earnings: Earnings[];

  @Column({ nullable: true })
  customerId: string;

  @Column({ default: false })
  hasPremium: boolean;
}
