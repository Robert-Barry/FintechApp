// src/features/wallet/components/__tests__/WalletDashboard.test.tsx
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import WalletDashboard from '../WalletDashboard';
import { walletService } from '../../services/walletService';
import { Alert } from 'react-native';

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

describe('WalletDashboard Component - User Interactions', () => {
    beforeEach(() => {
        // Clear out the memory before each test
        jest.clearAllMocks();
    });

    it('allows the user to withdraw their savings vault balance successfully', async () => {
        // Set up a spy
        const alertSpy = jest.spyOn(Alert, 'alert');

        const mockData = [
            { id: 1, description: 'Coffee House', amountInCents: -415 }, // Savings: +$0.85
            { id: 2, description: 'Cash Deposit', amountInCents: 10000 },  // Savings: +$0.00
        ];
        (walletService.getLatestTransactions as jest.Mock).mockResolvedValueOnce(mockData);

        const { getByText, queryByText } = render(<WalletDashboard />);

        await waitFor(() => {
            expect(queryByText('Loading wallet data...')).toBeNull();
        });

        // Verify inital values are displayed correctly
        expect(getByText('$95.85')).toBeTruthy();
        expect(getByText('+$0.85')).toBeTruthy();

        // Simulate physical finger tap
        const withdrawButton = getByText('Withdraw Vault to Main');
        fireEvent.press(withdrawButton);

        // The vault should drop to zero
        expect(getByText('$0.00')).toBeTruthy();

        // Main balance increases by 0.85
        expect(getByText('$96.70')).toBeTruthy();

        // Verify the alery works
        expect(alertSpy).toHaveBeenCalledWith(
            "Transfer Successful",
            expect.stringContaining('Successfully swept $0.85')
        );
    });
});