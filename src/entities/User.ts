import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  OneToOne, OneToMany,
} from 'typeorm';
import { Streak } from './Streak';
import { UserProgress } from './UserProgress';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'time', name: 'reminder_time', default: '20:00:00' })
  reminderTime: string;

  @Column({ type: 'text', name: 'expo_push_token', nullable: true })
  expoPushToken: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Streak, (streak) => streak.user)
  streak: Streak;

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress: UserProgress[];
}
