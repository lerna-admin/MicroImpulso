import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        document: string;
        password: string;
    }): Promise<{
        token: string;
        role: string;
    }>;
}
