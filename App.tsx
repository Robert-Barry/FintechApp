import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TransactionItem, { Transaction } from './src/features/wallet/components/TransactionItem';

const mockData: Transaction = {
  id: 1,
  description: 'USave Groceries',
  amountInCents: -4230,
}

export default function App() {
  return (
    <View style={styles.container}>
      <TransactionItem transaction={mockData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
