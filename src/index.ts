import { Client } from "discord.js"
import { AudioPlayer } from "@discordjs/voice"
import { config } from 'dotenv'
import https from 'https'
config()

const client = new Client({ 
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
})
let player: AudioPlayer | void | undefined

client.once('ready', () => {
	console.log('Smaug is now online.')
	console.log('')
})

let interaction
export { interaction }

import ping from './commands/general/ping'
import catjam from './commands/general/catjam'
import jamtime from './commands/music/jamtime'
import joinVoice from './commands/music/joinVoice'
import play from './commands/music/play'

// search example:
// const testUrl = "https://api-v2.soundcloud.com/search?q=white%20rabbit&client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I&limit=1"

// track id example:
// const testUrl = "https://api-v2.soundcloud.com/tracks/272314661?client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I"

/* get stream URL example:
get weird code from search from jsonThing.collection[0].media.transcodings[2].url.split('/')[5]
get weird code from track id from jsonThing.media.transcodings[2].url.split('/')[5]

Notes:
	might not always be 3 transcodings, find a way to search for the Opus codec
	index at position 5 might be incorrect */
// const testUrl = "https://api-v2.soundcloud.com/media/soundcloud:tracks:272314661/0e7792c9-34c5-4dde-9936-40ddcd95e5b5/stream/hls?client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I"

const request = https.get(testUrl, (res) => {
	console.log(`statusCode: ${res.statusCode}`)

	res.on('data', d=> {
		const jsonThing = JSON.parse(d)
		const testString = jsonThing.media.transcodings
		console.log(testString)
	})
})
request.on('error', error => {
	console.error(error)
})

request.end()

client.login(process.env.DISCORD_TOKEN)

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return

	console.log(`\nCommand: ${interaction.commandName}`)
	switch (interaction.commandName) {
	case 'ping': {
		ping(interaction)
		break
	}

	case 'catjam': {
		catjam(interaction)
		break
	}

	case 'jamtime': {
		jamtime(interaction)
		break
	}

	case 'joinvoice': {
		player = await joinVoice(interaction, true)
		break
	}

	case 'play': {
		play(interaction, player)
		break
	}
	}
})
