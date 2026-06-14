import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Problem } from './Problem';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'problem_id' })
  problemId: string;

  @ManyToOne(() => Problem, (problem) => problem.userProgress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'int', name: 'time_taken_seconds', nullable: true })
  timeTakenSeconds: number | null;

  @Column({ type: 'timestamptz', name: 'solved_at', default: () => 'NOW()' })
  solvedAt: Date;
}
