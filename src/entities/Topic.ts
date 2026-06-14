import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Stage } from './Stage';
import { Problem } from './Problem';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'stage_id' })
  stageId: string;

  @ManyToOne(() => Stage, (stage) => stage.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stage_id' })
  stage: Stage;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => Problem, (problem) => problem.topic)
  problems: Problem[];
}
