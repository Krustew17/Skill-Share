import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: '' })
  firstName: string;

  @Column({ nullable: true, default: '' })
  lastName: string;

  @Column({ nullable: true, default: '' })
  country: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
