import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column('simple-array')
  roles: string[];

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;


  @CreateDateColumn()
  createdAt: Date;
}
