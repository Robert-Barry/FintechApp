// app/transaction/[id].tsx
import React from 'react';
import { 
    View, 
    Text,
    StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useWallet } from '../../src/features/wallet/context/WalletContext';
import { USDformatter } from '../../src/utils/currencyFormatter';

export default function TransactionDetailsScreen() {
    // Get the prarmeter from the router path
    const { id } = useLocalSearchParams<{ id: string }>();
    const { transactions } = useWallet();

    // Match the URL ID against the state transaction objects
    const transaction = transactions.find(t => t.id === Number(id));

    if (!transaction) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Transaction record not found.</Text>
            </View>
        );
    }

    const formattedAmount = USDformatter.format(transaction.amountInCents / 100);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.merchantLabel}>Merchant Partner</Text>
                <Text style={styles.descriptionText}>{transaction.description}</Text>

                <View style={styles.row}>
                    <Text style={styles.infoLabel}>Settlement Amount</Text>
                    <Text style={[
                        styles.amountText,
                        transaction.amountInCents > 0 ? styles.expense : styles.income
                    ]}>
                        {formattedAmount}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F8F8F8', 
        padding: 16 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    errorText: { 
        fontSize: 16, 
        color: '#EF4444', 
        fontWeight: '600' 
    },
    card: { 
        backgroundColor: '#FFFFFF', 
        padding: 24, 
        borderRadius: 16, 
        borderWidth: 1, 
        borderColor: '#E2E8F0' 
    },
    merchantLabel: { 
        fontSize: 12, 
        color: '#64748B', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        letterSpacing: 0.5 
    },
    descriptionText: { 
        fontSize: 24, 
        fontWeight: '700', 
        color: '#0F172A', 
        marginTop: 4 
    },
    divider: { 
        height: 1, 
        backgroundColor: '#E2E8F0', 
        marginVertical: 16 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    infoLabel: { 
        fontSize: 14, 
        color: '#64748B' 
    },
    amountText: { 
        fontSize: 18, 
        fontWeight: '700' 
    },
    expense: { 
        color: '#0F172A' 
    },
    income: { 
        color: '#16A34A' 
    }
});