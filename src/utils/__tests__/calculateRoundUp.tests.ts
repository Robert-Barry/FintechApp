import { calculateRoundUp } from '../calculateRoundUp';

describe('calculateRoundUp', () => {
    it('should return the correct spare change for a standard fraction', () => {
        expect(calculateRoundUp(415)).toBe(85);
        expect(calculateRoundUp(4230)).toBe(70);
    });
});

describe('when user enters exact dollar boundary', () => {
    it('should return 0', () => {
        expect(calculateRoundUp(100)).toBe(0);
        expect(calculateRoundUp(500)).toBe(0);
    });
});

describe('when user enters negative number', () => {
    it('should throw an error', () => {
        expect(() => calculateRoundUp(-100)).toThrow();
        expect(() => calculateRoundUp(-234)).toThrow();
    });
});