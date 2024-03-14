/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		return new Response("Hello World!");
	},
};

// Fetch the latest coin prices
// Either throw an error or
// return object with format:
// {
// 	btcPrice: Number(),
// 	ethPrice: Number()
// }
export async function getLatestPrice (api_key, url) {}

// Compare the coin price with a threshold
// Either throw an error or return bool
export function compareThreshold (newPrice, threshold) {}

// Calls the Discord Webhook URL
// Either throw an error or return void
export async function callDiscordHook (url, message) {}
