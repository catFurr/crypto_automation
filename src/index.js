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
		const COINMARKETCAP_API = env.COINMARKETCAP_API
		const COINMARKETCAP_URL = env.COINMARKETCAP_URL
		const DISCORD_URL = env.DISCORD_URL
		try {
			let { btcPrice } = await getLatestPrice(COINMARKETCAP_API, COINMARKETCAP_URL)

			const threshold = 70000;
			let isThresholdReached = compareThreshold(btcPrice, threshold)

			if (isThresholdReached) {
				let message = "Bitcoin Price Fell Below the Threshold!";
				message += "\ncurrent price: " + String(btcPrice)
				message += "\nthreshold: " + String(threshold)
				await callDiscordHook(DISCORD_URL, message)
			}
		} catch (error) {
			let message = "Error in fetch handler: " + String(error);
			console.error(message)
			try {
				await callDiscordHook(DISCORD_URL, message)
			} catch (discord_error) {
				console.error("Error in calling Discord: ", discord_error)
			}

			return new Response.error(message)
		}

		return new Response("Completed.");
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
