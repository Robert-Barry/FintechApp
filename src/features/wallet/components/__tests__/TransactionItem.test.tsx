import React from 'react';
import { render } from '@testing-library/react-native';
import TransactionItem from '../TransactionItem'

describe('Transaction Component', () => {
    const mockTransaction = {
        id: 1,
        description: 'USave Groceries',
        amountInCents: -4230,
    };

    it('renders transaction details and the calculated round-up amount', () => {
        // Math check: -4230 cents is $42.30. Absolute value is 4230. 
        // Round up is 70 cents (+$0.70).
        const { getByText } = render(<TransactionItem transaction={mockTransaction} />);

        expect(getByText('USave Groceries')).toBeTruthy();
        expect(getByText('-$42.30')).toBeTruthy();
        expect(getByText('Spare Change Round-up')).toBeTruthy();
        expect(getByText('+$0.70')).toBeTruthy();
    });

    it('does not render round-up details if the amount is an exact dollar', () => {
        const exactDollarTransaction = {
            id: 2,
            description: 'Gas Station',
            amountInCents: -4000,
        };

        const { getByText, queryByText } = render(<TransactionItem transaction={exactDollarTransaction} />);

        expect(getByText('Gas Station')).toBeTruthy();
        expect(getByText('-$40.00')).toBeTruthy();
        expect(queryByText('Spare Change Round-up')).toBeNull();
    });
});