import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
export declare class ClientsService {
    private readonly clientRepository;
    constructor(clientRepository: Repository<Client>);
    findAll(): Promise<Client[]>;
    findOne(id: number): Promise<Client | null>;
    create(data: Partial<Client>): Promise<Client>;
}
