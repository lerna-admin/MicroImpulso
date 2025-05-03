import { Client } from './client.entity';
import { CashFlow } from './cash-flow.entity';
import { ChatMessage } from './chat-message.entity';
export declare enum UserRole {
    AGENT = "AGENT",
    ADMINISTRATOR = "ADMINISTRATOR",
    MANAGER = "MANAGER"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    clients: Client[];
    cashFlows: CashFlow[];
    chatMessages: ChatMessage[];
}
