// Testing callDiscordHook function

import { callDiscordHook  } from "../src/index";
import { deleteDiscordMessage } from "../src/utils";

// Calls the Discord Webhook URL
// Either throw an error or return void
// async function callDiscordHook (url, message) {}

import { config } from 'dotenv'
config({ path: './.env' })
const URL = process.env.DISCORD_URL

test('call returns void', async () => {
    const message_id = await callDiscordHook(URL, "Test: call returns void")
    expect(message_id).toBeDefined()
    await expect(
        deleteDiscordMessage(URL, message_id)
    ).resolves.toBeTruthy()
});

// test('wrong url throws error', async () => {
//     await expect(
//         callDiscordHook("error", "https://google.com/")
//     ).rejects.toThrow()
// });

test('bad url throws error', async () => {
    await expect(
        callDiscordHook("error", "Test")
    ).rejects.toThrow("Failed to parse URL")
});

test('bad url type throws error', async () => {
    await expect(
        callDiscordHook(123, "Test")
    ).rejects.toThrow("Failed to parse URL")
});
