
// Testing getLatestPrice function

import { getLatestPrice } from "../src/index";

// Fetch the latest coin prices
// Either throw an error or
// return object with format:
// {
// 	btcPrice: Number(),
// 	ethPrice: Number()
// }
// async function getLatestPrice (api_key, url) {}

import { config } from 'dotenv'
config({ path: './.dev.vars' })
const API_KEY = process.env.COINMARKETCAP_API_KEY
const URL = process.env.COINMARKETCAP_URL

test('call returns object', async () => {
    const data = await getLatestPrice(API_KEY, URL)
    expect(data).toEqual(expect.objectContaining({
        btcPrice: expect.any(Number),
        ethPrice: expect.any(Number)
      }))
});

test('wrong api_key throws error', async () => {
    expect.assertions(1);
    try {
        await getLatestPrice("wrong key", URL)
    } catch (error) {
        expect(error.message).toContain('Server returned bad response code');
    }
});

test('wrong url throws error', async () => {
    expect.assertions(1);
    try {
        await getLatestPrice("wrong key", "wrong url")
    } catch (error) {
        expect(error.message).toContain("Failed to parse URL")
    }
});

test('bad api_key type throws error', async () => {
    expect.assertions(1);
    try {
        await getLatestPrice(123, URL)
    } catch (error) {
        expect(error.message).toContain('Server returned bad response code');
    }
});

test('bad url type throws error', async () => {
    expect.assertions(1);
    try {
        await getLatestPrice("wrong key", 123)
    } catch (error) {
        expect(error.message).toContain("Failed to parse URL")
    }
});
