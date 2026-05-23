// src/features/wallet/components/__tests__/WalletDashboard.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import WalletDashboard from '../WalletDashboard';
import { walletService } from '../../services/walletService';

// Tell Jest to intercept requests going to our service layer
jest.mock('../../services/walletService', () => ({
  walletService: {
    getLatestTransactions: jest.fn(),
  },
}));

describe('WalletDashboard Component - Async Fetching', () => {
  it('displays a loading indicator initially, then renders data after a successful API fetch', async () => {
    // 1. Arrange: Tell our mocked service exactly what data to return when called
    const mockData = [
      { id: 1, description: 'Coffee House', amountInCents: -415 },
      { id: 2, description: 'Walmart Supercenter', amountInCents: -4230 },
    ];
    (walletService.getLatestTransactions as jest.Mock).mockResolvedValueOnce(mockData);

    // 2. Act: Render the dashboard (it won't receive a transactions prop anymore!)
    const { getByText, queryByText } = render(<WalletDashboard />);

    // 3. Assert Immediate Loading State: Check that loading text is visible
    expect(getByText('Loading wallet data...')).toBeTruthy();

    // 4. Assert Async Success State: Use waitFor to pause until the loading screen goes away 
    // and our data elements appear on the screen.
    await waitFor(() => {
      expect(queryByText('Loading wallet data...')).toBeNull();
      expect(getByText('Coffee House')).toBeTruthy();
      expect(getByText('+$0.85')).toBeTruthy(); // Checking the individual item round-up
    });
  });
});