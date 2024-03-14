
import { compareThreshold } from '../src/index';

// Compare the coin price with a threshold
// Either throw an error or return bool
// function compareThreshold (newPrice, threshold) {}

test('newprice > thresh returns false', () => {
    expect(compareThreshold(5, 2)).toBe(false);
});

test('newprice < thresh returns true', () => {
    expect(compareThreshold(1, 4)).toBe(true);
});

test('newprice = thresh returns false', () => {
    expect(compareThreshold(5, 5)).toBe(false);
});

// test('newprice as string, throws error', () => {
//     expect(compareThreshold("error", 2)).toBe(false);
// });

// test('thresh as string, throws error', () => {
//     expect(compareThreshold(1, "error")).toBe(false);
// });