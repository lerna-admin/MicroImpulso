import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { LoanRequest } from './loan-request.entity';
import { Document } from './document.entity';
import { ChatMessage } from './chat-message.entity';

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PROSPECT = 'PROSPECT',
}

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'text',
  })
  status: ClientStatus;
  

  @ManyToOne(() => User, (user) => user.clients)
  @JoinColumn({ name: 'agentId' })
  agent: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => LoanRequest, (loanRequest) => loanRequest.client)
  loanRequests: LoanRequest[];

  @OneToMany(() => Document, (document) => document.client)
  documents: Document[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.client)
  chatMessages: ChatMessage[];
}
