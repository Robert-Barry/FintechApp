import React from "react";
import { USDformatter } from "../../../utils/currencyFormatter";
import { 
    View, 
    Text,
    Pressable, 
    FlatList,
    StyleSheet,
} from "react-native";
import TransactionItem from "../components/TransactionItem";
import { useWallet, WalletProvider } from "../context/WalletContext";

function DashboardComponent() {
    const {
        transactions, 
        accountTotalInCents, 
        vaultBalanceInCents, 
        isLoading, 
        withdrawVaultToMain
    } = useWallet();

    const formattedTotal = USDformatter.format(accountTotalInCents / 100);
    const formattedSavings = USDformatter.format(vaultBalanceInCents / 100);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Loading wallet data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header / Summary / Blocks */}
            <View style={styles.summaryCard}>
                <Text style={styles.label}>Total Balance</Text>
                <Text style={styles.balanceText}>{formattedTotal}</Text>

                <View style={styles.savingsRow}>
                    <Text style={styles.savingsLabel}>Savings Vault Balance: </Text>
                    <Text style={styles.savingsValue}>{formattedSavings}</Text>
                </View>
                
                {/* Withdraw Action Trigger Button */}
                <Pressable 
                    onPress={withdrawVaultToMain} 
                    style={({ pressed }) => [
                        styles.withdrawButton,
                        pressed && styles.buttonPressed,
                        vaultBalanceInCents <= 0 && styles.buttonDisabled
                    ]}
                    disabled={vaultBalanceInCents <= 0}
                >
                    <Text style={styles.withdrawButtonText}>Withdraw Vault to Main</Text>
                </Pressable>
            </View>

            <Text style={styles.listHeader}>Recent Transactions</Text>

            <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionItem transaction={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

export default function WalletDashboard() {
    return (
        <WalletProvider>
            <DashboardComponent />
        </WalletProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8'
    },
    loadingText: {
        fontSize: 16,
        color: '#64748B',
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
    withdrawButton: {
        backgroundColor: '#0F172A',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonDisabled: {
        backgroundColor: '#CBD5E1',
    },
    withdrawButtonText: {
        color: '#FFFFFF',
        fontWeight: 600,
        fontSize: 14,
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