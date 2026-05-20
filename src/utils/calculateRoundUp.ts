
export function calculateRoundUp(amountInCents: number): number {
    let numberToReturn = 0;

    if (amountInCents < 0) {
        throw new Error("Amount cannot be negative");
    } else if (amountInCents % 100 === 0) {
        numberToReturn = 0;
    } else {
        const nextNultipleOf100 = amountInCents - (amountInCents % 100) + 100;
        numberToReturn = nextNultipleOf100 - amountInCents;
    }

    return numberToReturn;
}