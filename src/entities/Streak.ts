import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('streaks')
export class Streak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.streak, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', name: 'current_streak', default: 0 })
  currentStreak: number;

  @Column({ type: 'int', name: 'longest_streak', default: 0 })
  longestStreak: number;

  @Column({ type: 'date', name: 'last_active_date', nullable: true })
  lastActiveDate: string | null;
}
