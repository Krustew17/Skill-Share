import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TalentCards } from './talentcards.entity';
import { User } from '../users/users.entity';

@Entity()
export class TalentReviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => TalentCards, (talentCard) => talentCard.talentReviews)
  talentCard: TalentCards;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.talentReviews)
  user: User;
}
