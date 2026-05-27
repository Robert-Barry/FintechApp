// src/features/wallet/components/__tests__/WalletDashboard.test.tsx
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import WalletDashboard from '../../../../../app/index'; // Cleaned extension path
import { walletService } from '../../services/walletService';
import { WalletProvider } from '../../context/WalletContext'; // 🆕 Import the Provider wrapper
import { Alert } from 'react-native';

jest.mock('../../services/walletService', () => ({
  walletService: {
    getLatestTransactions: jest.fn(),
  },
}));

// Global mock for expo-router to prevent navigation layer runtime crashes
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('WalletDashboard Component - Integration Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays a loading indicator initially, then renders data after a successful API fetch', async () => {
    const mockData = [
      { id: 1, description: 'Coffee House', amountInCents: -415 },
      { id: 2, description: 'Grocery Store', amountInCents: -4230 },
    ];
    (walletService.getLatestTransactions as jest.Mock).mockResolvedValueOnce(mockData);

    // FIX: Wrap the dashboard inside the WalletProvider so the hook resolves perfectly!
    const { getByText, queryByText } = render(
      <WalletProvider>
        <WalletDashboard />
      </WalletProvider>
    );

    expect(getByText('Loading wallet data...')).toBeTruthy();

    await waitFor(() => {
      expect(queryByText('Loading wallet data...')).toBeNull();
      expect(getByText('Coffee House')).toBeTruthy();
    });
  });

  it('allows the user to withdraw their savings vault balance successfully', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const mockData = [
      { id: 1, description: 'Coffee House', amountInCents: -415 },   // Savings: +$0.85
      { id: 2, description: 'Cash Deposit', amountInCents: 10000 },  // Savings: +$0.00
    ];
    (walletService.getLatestTransactions as jest.Mock).mockResolvedValueOnce(mockData);

    // FIX: Wrap the dashboard inside the WalletProvider here as well!
    const { getByText, queryByText } = render(
      <WalletProvider>
        <WalletDashboard />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading wallet data...')).toBeNull();
    });

    expect(getByText('$95.85')).toBeTruthy(); 
    expect(getByText('$0.85')).toBeTruthy();  

    const withdrawButton = getByText('Withdraw Vault to Main');
    fireEvent.press(withdrawButton);

    await waitFor(() => {
      expect(getByText('$0.00')).toBeTruthy();
      expect(getByText('$96.70')).toBeTruthy();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Transfer Successful",
      expect.stringContaining("Successfully swept $0.85")
    );
  });
});