import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Client } from './client.entity';
import { User } from './user.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.chatMessages)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => User, (user) => user.chatMessages)
  @JoinColumn({ name: 'agentId' })
  agent: User;

  @Column('text')
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}
