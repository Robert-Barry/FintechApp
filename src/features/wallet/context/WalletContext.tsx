import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Transaction } from '../types';
import { walletService } from '../services/walletService';
import { calculateRoundUp } from '../../../utils/calculateRoundUp';
import { USDformatter } from '../../../utils/currencyFormatter'

interface WalletContextType {
    transactions: Transaction[];
    accountTotalInCents: number;
    vaultBalanceInCents: number;
    isLoading: boolean;
    error: any | null;
    withdrawVaultToMain: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children } : { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accountTotalInCents, setAccountTotalInCents] = useState<number>(0);
    const [vaultBalanceInCents, setVaultBalanceInCents] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any | null>(null);

    // Inital load
    useEffect(() => {
        (async function initWallet() {
            try {
                const data = await walletService.getLatestTransactions();
                setTransactions(data);

                // Calculate primary checking balance total
                const checkingTotal = data.reduce((sum, tx) => sum + tx.amountInCents, 0);
                setAccountTotalInCents(checkingTotal);

                // Seed the initial vault balance from the purchase round-ups
                const initialSavings = data.reduce((sum, tx) => {
                    let roundUp = 0;
                    if (tx.amountInCents < 0) {
                        roundUp = calculateRoundUp(Math.abs(tx.amountInCents));
                    }
                    return sum + roundUp;
                }, 0);
                setVaultBalanceInCents(initialSavings);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Withdrawal Action Pipeline Layout
    const withdrawVaultToMain = () => {
        if (vaultBalanceInCents <= 0) return;

        const amountToTransfer = vaultBalanceInCents;

        // Atomic State Updates
        setVaultBalanceInCents(0); // Empty the vault
        setAccountTotalInCents((prev) => prev + amountToTransfer); // Credit main account

        // Provide native feedback
        const formattedAmount = USDformatter.format(amountToTransfer / 100);

        Alert.alert(
            "Transfer Successful",
            `Successfully swept ${formattedAmount} from your savings valut back into your primary account balance.`
        );
    }

    return (
        <WalletContext.Provider value={{
            transactions,
            accountTotalInCents,
            vaultBalanceInCents,
            isLoading,
            error,
            withdrawVaultToMain
        }}>
            { children }
        </WalletContext.Provider>
    );
}

// Custom hook for clean component consumption
export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}