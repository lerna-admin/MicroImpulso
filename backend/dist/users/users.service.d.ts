import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByDocument(document: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
}
