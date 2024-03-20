/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { deleteDiscordMessage } from "./utils";

export default {
	async fetch(request, env, ctx) {
		try{
			let resp = await handleEvent(env)
			return new Response(resp)
		} catch (error) {
			return new Response(error.message, { status: 500, statusText: "Server Error" });
		}
	},

	async scheduled(event, env, ctx) {
		ctx.waitUntil(handleEvent(env));
	},
};

async function handleEvent (env) {
	const COINMARKETCAP_API = env.COINMARKETCAP_API_KEY
	const COINMARKETCAP_URL = env.COINMARKETCAP_URL
	const DISCORD_URL = env.DISCORD_URL
	const IS_DEV_ENV = env.ENVIRONMENT == "DEV"
	const THRESHOLD = env.THRESHOLD
	try {
		let { btcPrice } = await getLatestPrice(COINMARKETCAP_API, COINMARKETCAP_URL)

		let isThresholdReached = compareThreshold(btcPrice, THRESHOLD)

		if (isThresholdReached) {
			let message = "Bitcoin Price Fell Below the Threshold!";
			message += "\ncurrent price: " + String(btcPrice)
			message += "\nthreshold: " + String(THRESHOLD)
			const message_id = await callDiscordHook(DISCORD_URL, message)

			if (IS_DEV_ENV) {
				deleteDiscordMessage(DISCORD_URL, message_id)
			}
		}
	} catch (error) {
		console.error(error)
		if (!IS_DEV_ENV) {
			try {
				await callDiscordHook(DISCORD_URL, error.message)
			} catch (discord_error) {
				console.error(discord_error)
			}
		}

		throw error
	}

	return "Completed.";
}

// Fetch the latest coin prices
// Either throw an error or
// return object with format:
// {
// 	btcPrice: Number(),
// 	ethPrice: Number()
// }
export async function getLatestPrice (api_key, url) {
	const params = {
		symbol: 'BTC,ETH',
		convert: 'USD'
	};

	var response = await fetch(`${url}?${new URLSearchParams(params)}`, {
		headers: {
		'X-CMC_PRO_API_KEY': api_key
		}
	});

	if (!response.ok) {
		const data = await response.text()
		let message = "CoinMarketCap server returned bad response code: " + String(response.status)
		message += "\nresponse message: " + String(response.statusText)
		message += "\nserver response: " + data
		throw new Error(message)
	}

	const data = await response.json();

	const btcData = data.data.BTC;
	const ethData = data.data.ETH;

	return {
		btcPrice: Math.round(btcData.quote.USD.price),
		ethPrice: Math.round(ethData.quote.USD.price)
	};
}

// Compare the coin price with a threshold
// return true if newPrice is lower, else false
export function compareThreshold (newPrice, threshold) {
	return Number(newPrice) < Number(threshold)
}

// Calls the Discord Webhook URL
// Either throw an error or return void
export async function callDiscordHook (url, message) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
	const urlencoded = new URLSearchParams();
	urlencoded.append("content", message);

	var response = await fetch(url+"?wait=true", {
		method: "POST",
		headers: myHeaders,
		body: urlencoded
	});

	if (!response.ok) {
		const data = await response.text()
		let message = "Discord server returned bad response code: " + String(response.status)
		message += "\nresponse message: " + String(response.statusText)
		message += "\nserver response: " + data
		throw new Error(message)
	}

	const data = await response.json()

	return data.id
}
