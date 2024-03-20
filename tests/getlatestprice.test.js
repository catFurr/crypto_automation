
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
config({ path: './.env' })
const API_KEY = process.env.COINMARKETCAP_API_KEY
const URL = process.env.COINMARKETCAP_URL

test('call returns object', async () => {
    const data = await getLatestPrice(API_KEY, URL)
    expect(data).toEqual(expect.objectContaining({
        btcPrice: expect.any(Number),
        ethPrice: expect.any(Number)
      }))
});

test("wrong api_key throws error", async () => {
    await expect(
        getLatestPrice("wrong key", URL)
    ).rejects.toThrow("server returned bad response code")
});

test("bad url throws error", async () => {
    await expect(
        getLatestPrice("wrong key", "wrong url")
    ).rejects.toThrow("Failed to parse URL")
});

test("wrong url throws error", async () => {
    await expect(
        getLatestPrice("wrong key", "https://google.com/")
    ).rejects.toThrow()
});

test("bad api_key type throws error", async () => {
    await expect(
        getLatestPrice(123, URL)
    ).rejects.toThrow("server returned bad response code")
});

test("bad url type throws error", async () => {
    await expect(
        getLatestPrice("wrong key", 123)
    ).rejects.toThrow("Failed to parse URL")
});
