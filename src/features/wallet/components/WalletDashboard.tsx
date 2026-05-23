import { useState, useEffect } from "react";
import { calculateRoundUp } from "../../../utils/calculateRoundUp";
import { 
    View, 
    Text, 
    FlatList,
    StyleSheet,
} from "react-native";
import TransactionItem from "../components/TransactionItem";
import { Transaction } from '../types';
import { walletService } from "../services/walletService";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function WalletDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any | null>(null);

    useEffect(() => {
        (async function fetchWalletData() {
            try {
                const data = await walletService.getLatestTransactions();
                setTransactions(data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const accountTotalInCents = transactions.reduce((total: number, transaction: Transaction) => {
        return total + transaction.amountInCents;
    }, 0);

    const roundUpInCents = transactions.reduce((total: number, transaction: Transaction) => {
        let roundUpInCents = 0;

        if (transaction.amountInCents < 0) {
            const absoluteCents = Math.abs(transaction.amountInCents);
            // Calculate the round up
            roundUpInCents = calculateRoundUp(absoluteCents);
        }

        return total + roundUpInCents;
    }, 0);

    const formattedTotal = formatter.format(accountTotalInCents / 100);
    const formattedSavings = formatter.format(roundUpInCents / 100);

    return (
        <>
        {isLoading ? (
            <Text>Loading wallet data...</Text>
        ) : (
            <View style={styles.container}>
                {/*  Header / Summary / Blocks */}
                <View style={styles.summaryCard}>
                    <Text style={styles.label}>Total Balance</Text>
                    <Text style={styles.balanceText}>{formattedTotal}</Text>

                    <View style={styles.savingsRow}>
                        <Text style={styles.savingsLabel}>Total Round-Up Saved: </Text>
                        <Text style={styles.savingsValue}>{formattedSavings}</Text>
                    </View>
                </View>

                <Text style={styles.listHeader}>Recent Transactions</Text>

                <FlatList
                    data={transactions}
                    renderItem={({ item }) => <TransactionItem transaction={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        margin: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    balanceText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#0F172A',
        marginVertical: 8,
    },
    savingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    savingsLabel: {
        fontSize: 14,
        color: '#64748B',    
    },
    savingsValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#16A34A',
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 700,
        color: '#334155',
        marginHorizontal: 16,
        marginBottom: 8,
    },
    listContainer: {
        paddingHorizontal: 16,
    }
});