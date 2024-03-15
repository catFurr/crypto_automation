// Testing compareThreshold function

import { compareThreshold } from '../src/index';

// Compare the coin price with a threshold
// Either throw an error or return bool
// function compareThreshold (newPrice, threshold) {}

test('newPrice < threshold returns true', () => {
    expect(compareThreshold(1, 5)).toBe(true);
});

test('newPrice > threshold returns false', () => {
    expect(compareThreshold(5, 1)).toBe(false);
});

test('newPrice = threshold returns false', () => {
    expect(compareThreshold(5, 5)).toBe(false);
});

test('bad newPrice type returns false', () => {
    expect(compareThreshold("error", 5)).toBe(false);
});

test('bad threshold type returns false', () => {
    expect(compareThreshold(5, "error")).toBe(false);
});

test('bad newPrice,threshold types returns false', () => {
    expect(compareThreshold("error", "error")).toBe(false);
});
