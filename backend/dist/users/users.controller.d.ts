import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByDocument(doc: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
}
