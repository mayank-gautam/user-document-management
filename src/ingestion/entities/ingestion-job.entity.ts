import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from '../../documents/document.entity';

@Entity('ingestion_job')
export class IngestionJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentId: number;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'success' | 'failed';

  @CreateDateColumn()
  createdAt: Date;
}
