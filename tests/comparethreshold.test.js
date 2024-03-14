// Testing compareThreshold function

import { compareThreshold } from '../src/index';

// Compare the coin price with a threshold
// Either throw an error or return bool
// function compareThreshold (newPrice, threshold) {}

test('newPrice > threshold returns false', () => {
    expect(compareThreshold(5, 1)).toBe(false);
});

test('newPrice = threshold returns false', () => {
    expect(compareThreshold(5, 5)).toBe(false);
});

test('newPrice < threshold returns true', () => {
    expect(compareThreshold(1, 5)).toBe(true);
});

test('bad newPrice type throws error', () => {
    expect.assertions(1);
    try {
        compareThreshold("error", 5)
    } catch (error) {
        expect(error).toMatch("Invalid price value!")
    }
});

test('bad threshold type throws error', () => {
    expect.assertions(1);
    try {
        compareThreshold(5, "error")
    } catch (error) {
        expect(error).toMatch("Invalid threshold value!")
    }
});
