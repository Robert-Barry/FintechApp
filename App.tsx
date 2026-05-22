import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import WalletDashboard from './src/features/wallet/components/WalletDashboard';
import { transactions } from './src/features/wallet/components/__tests__/fixtures';

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
