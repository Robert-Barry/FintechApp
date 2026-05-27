// src/features/wallet/context/WalletContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { walletService } from '../services/walletService';
import { calculateRoundUp } from '../../../utils/calculateRoundUp';
import { USDformatter } from '../../../utils/currencyFormatter'

// Async storage identifiers
const VAULT_BALANCE_KEY = '@fintech_valut_balance_cents';
const ACCOUNT_TOTAL_KEY = '@fintech_account_total_cents';

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
                const defaultCheckingTotal = data.reduce((sum, tx) => sum + tx.amountInCents, 0);
                const defaultInitialSavings = data.reduce((sum, tx) => {
                    let roundUp = 0;
                    if (tx.amountInCents < 0) {
                        roundUp = calculateRoundUp(Math.abs(tx.amountInCents));
                    }
                    return sum + roundUp;
                }, 0);

                // Look for historical actions
                const savedVault = await AsyncStorage.getItem(VAULT_BALANCE_KEY);
                const savedTotal = await AsyncStorage.getItem(ACCOUNT_TOTAL_KEY);

                // Override values only if persistent records exist
                if (savedVault !== null && savedTotal !== null) {
                    setVaultBalanceInCents(Number(savedVault));
                    setAccountTotalInCents(Number(savedTotal));
                } else {
                    setVaultBalanceInCents(defaultInitialSavings);
                    setAccountTotalInCents(defaultCheckingTotal);
                }
                
            } catch (err) {
                console.error("Initialization failure: ", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Withdrawal Action Pipeline Layout
    const withdrawVaultToMain = async () => {
        if (vaultBalanceInCents <= 0) return;

        const amountToTransfer = vaultBalanceInCents;
        const newVaultBalance = 0;
        const newAccountTotal = accountTotalInCents + amountToTransfer;

        try {
            await AsyncStorage.setItem(VAULT_BALANCE_KEY, String(newVaultBalance));
            await AsyncStorage.setItem(ACCOUNT_TOTAL_KEY, String(newAccountTotal));

            // Save state
            setVaultBalanceInCents(newVaultBalance);
            setAccountTotalInCents(newAccountTotal);

            const formattedAmount = USDformatter.format(amountToTransfer / 100);

            Alert.alert(
                "Transfer Successful",
                `Successfully swept ${formattedAmount} from your savings valut back into your primary account balance.`
            );
        } catch (storageError) {
            console.error("Failed to save transaction data to local disk: ", storageError);
            Alert.alert("Storage Error", "Your transaction was processed but could not be saved to this device.");
        }
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