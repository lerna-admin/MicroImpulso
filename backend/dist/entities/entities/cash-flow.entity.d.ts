import { User } from './user.entity';
export declare enum CashFlowType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare class CashFlow {
    id: string;
    user: User;
    type: CashFlowType;
    amount: number;
    description: string;
    createdAt: Date;
}
