// Testing callDiscordHook function

import { callDiscordHook  } from "../src/index";

// Calls the Discord Webhook URL
// Either throw an error or return void
// async function callDiscordHook (url, message) {}

import { config } from 'dotenv'
config({ path: './.dev.vars' })
const URL = process.env.DISCORD_URL

test('call returns void', async () => {
    console.log(URL)
    await callDiscordHook(URL, "Test: call returns void")
});

test('wrong url throws error', async () => {
    expect.assertions(1);
    try {
        await callDiscordHook("error", "Test")
    } catch (error) {
        expect(error).toMatch("Invalid URL!")
    }
});

test('bad message type throws error', async () => {
    expect.assertions(1);
    try {
        await callDiscordHook(URL, 123)
    } catch (error) {
        expect(error).toMatch("Invalid message value!")
    }
});

test('bad url type throws error', async () => {
    expect.assertions(1);
    try {
        await callDiscordHook(123, "Test")
    } catch (error) {
        expect(error).toMatch("Invalid URL!")
    }
});
