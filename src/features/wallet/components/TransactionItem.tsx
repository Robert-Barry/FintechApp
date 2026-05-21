import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { calculateRoundUp } from '../../../utils/calculateRoundUp';

export interface Transaction {
    id: number;
    description: string;
    amountInCents: number;
}

interface ChildProps {
    transaction: Transaction;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function TransactionItem({ transaction }: ChildProps) {
    // Format the main purchase string (-4230 -> "$42.30").
    const currency = formatter.format(transaction.amountInCents / 100);

    // Make sure the transaction is positive before sending to round up.
    const absoluteCents = Math.abs(transaction.amountInCents);
    const roundUpCents = calculateRoundUp(absoluteCents);

    // Format the savings change string (70 -> "0.70")
    const roundUpString = formatter.format(roundUpCents / 100);

    return (
        <View style={styles.container}>
            {/* Main TransactionRow */}
            <View style={styles.mainRow}>
                <Text style={styles.description}>{transaction.description}</Text>
                <Text style={styles.amount}>{currency}</Text>
            </View>

            {/* Conditional Round Up Savings Row */}
            {Number(roundUpCents) > 0 && (
                <View style={styles.roundUpRow}>
                    <Text style={styles.roundUpLabel}>Spare Change Round-up</Text>
                    <Text style={styles.roundUpAmount}>+{roundUpString}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A202C',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  roundUpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  roundUpLabel: {
    fontSize: 14,
    color: '#718096',
  },
  roundUpAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#38A169', // A clean fintech green for positive savings growth
  },
});