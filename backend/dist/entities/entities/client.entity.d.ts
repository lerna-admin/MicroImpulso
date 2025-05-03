import { User } from './user.entity';
import { LoanRequest } from './loan-request.entity';
import { Document } from './document.entity';
import { ChatMessage } from './chat-message.entity';
export declare enum ClientStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PROSPECT = "PROSPECT"
}
export declare class Client {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: ClientStatus;
    agent: User;
    createdAt: Date;
    updatedAt: Date;
    loanRequests: LoanRequest[];
    documents: Document[];
    chatMessages: ChatMessage[];
}
