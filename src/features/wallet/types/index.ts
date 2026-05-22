// Describes a single user transaction
export interface Transaction {
    id: number;
    description: string;
    amountInCents: number;
}