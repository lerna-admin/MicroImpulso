import { Client } from './client.entity';
import { ChatMessage } from './chat-message.entity';
import { CashFlow } from './cash-flow.entity';
export declare enum UserRole {
    AGENT = "AGENT",
    ADMINISTRATOR = "ADMINISTRATOR",
    MANAGER = "MANAGER"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    document: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    clients: Client[];
    chatMessages: ChatMessage[];
    cashFlows: CashFlow[];
}
