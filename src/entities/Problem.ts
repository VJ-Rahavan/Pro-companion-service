import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Topic } from './Topic';
import { UserProgress } from './UserProgress';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'topic_id' })
  topicId: string;

  @ManyToOne(() => Topic, (topic) => topic.problems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  difficulty: string;

  @Column({ type: 'text' })
  pattern: string;

  @OneToMany(() => UserProgress, (up) => up.problem)
  userProgress: UserProgress[];
}
