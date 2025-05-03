import { Client } from './client.entity';
export declare class Document {
    id: string;
    client: Client;
    type: string;
    url: string;
    createdAt: Date;
}
