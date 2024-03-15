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
		let resp = await handleEvent(env)

		return resp;
	},

	async scheduled(event, env, ctx) {
		ctx.waitUntil(handleEvent(env));
	},
};

async function handleEvent (env) {
	const COINMARKETCAP_API = env.COINMARKETCAP_API_KEY
	const COINMARKETCAP_URL = env.COINMARKETCAP_URL
	const DISCORD_URL = env.DISCORD_URL
	try {
		let { btcPrice } = await getLatestPrice(COINMARKETCAP_API, COINMARKETCAP_URL)

		const threshold = 60000;
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

		return new Response(message, { status: 500, statusText: "Server Error" });
	}

	return new Response("Completed.");
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
		throw new Error("Server returned bad response code: " + String(response.status))
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

	var response = await fetch(url, {
		method: "POST",
		headers: myHeaders,
		body: urlencoded
	});

	if (!response.ok) {
		throw new Error("Server returned bad response code: " + String(response.status))
	}
}
