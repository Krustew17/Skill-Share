import { Job } from 'src/jobs/jobs.entity';
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
}
