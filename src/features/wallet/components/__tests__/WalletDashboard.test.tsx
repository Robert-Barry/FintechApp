import React from 'react';
import { render } from '@testing-library/react-native';
import WalletDashboard from '../WalletDashboard';

describe('WalletDashboard Component', () => {
    const mockTransactions = [
        { id: 1, description: 'Coffee House', amountInCents: -415 },
        { id: 2, description: 'Grocery Store', amountInCents: -4230 },
        { id: 3, description: 'Paycheck', amountInCents: 150000 },
    ];

    it('calculates and renders the total balance and cumulative round-up savings correctly', () => {
        const { getByText } = render(<WalletDashboard transactions={mockTransactions} />);

        // Check aggregates
        expect(getByText('$1,453.55')).toBeTruthy();
        expect(getByText('$1.55')).toBeTruthy();

        // Check that the list rendered the inner items, also
        expect(getByText('Coffee House')).toBeTruthy();
        expect(getByText('Grocery Store')).toBeTruthy();
    });
});