import { Client } from './client.entity';
export declare enum LoanRequestStatus {
    NEW = "NEW",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}
export declare class LoanRequest {
    id: string;
    amount: number;
    status: LoanRequestStatus;
    client: Client;
    createdAt: Date;
    updatedAt: Date;
}
