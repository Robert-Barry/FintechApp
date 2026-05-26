// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { WalletProvider } from '../src/features/wallet/context/WalletContext';

export default function RootLayout() {
    return (
        <WalletProvider>
            <Stack 
                screenOptions={{
                    headerStyle: { backgroundColor: '#0F172A' },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: { fontWeight: '700' },
                }}
        >
                <Stack.Screen name="index" options={{ title: 'Fintech Wallet' }} />
                <Stack.Screen name="transaction/[id]" options={{ title: 'Transaction Details' }} />
            </Stack>
        </WalletProvider>
    );
}