import { Client } from './client.entity';
import { User } from './user.entity';
export declare class ChatMessage {
    id: string;
    client: Client;
    agent: User;
    message: string;
    timestamp: Date;
}
