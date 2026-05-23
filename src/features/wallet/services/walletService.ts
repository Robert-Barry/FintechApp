import { Transaction } from '../types';
import { transactions } from '../utils/fixtures';

export const walletService = {
    /**
     * Fetches the user's latest transaction history from the Fintech secure ledger API.
     */
    getLatestTransactions: (): Promise<Transaction[]> => {
        return new Promise((resolve) => {
            // Simulate a 1-second network latency drop from the cloud server
            setTimeout(() => {
                resolve(transactions);
            }, 1000);
        });
    },
};