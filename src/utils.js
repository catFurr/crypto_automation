
export async function deleteDiscordMessage(url, message_id) {
	var response = await fetch(url+"/messages/"+message_id, {
		method: "DELETE"
	});

	if (!response.ok) {
		const data = await response.text()
		let message = "Discord server returned bad response code: " + String(response.status)
		message += "\nresponse message: " + String(response.statusText)
		message += "\nserver response: " + data
        console.error(message)
		return false
	}

    return true
}
