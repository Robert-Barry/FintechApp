import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WalletDashboard from './src/features/wallet/components/WalletDashboard';
import { Transaction } from './src/features/wallet/components/TransactionItem';

const transactions: Transaction[] = [
    { id: 1, description: 'Coffee House', amountInCents: -415 },
    { id: 2, description: 'Grocery Store', amountInCents: -4230 },
    { id: 3, description: 'Paycheck', amountInCents: 150000 },
];

export default function App() {
  return (
    <View style={styles.container}>
      <WalletDashboard transactions={transactions} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 150
  },
});
