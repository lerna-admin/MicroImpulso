import { ClientsService } from './clients.service';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    findAll(): Promise<import("../entities/client.entity").Client[]>;
    findOne(id: number): Promise<import("../entities/client.entity").Client | null>;
    create(body: any): Promise<import("../entities/client.entity").Client>;
}
