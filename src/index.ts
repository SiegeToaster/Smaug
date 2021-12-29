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

const testOptions = {
	hostname: 'api-v2.soundcloud.com',
	path: '/search/queries',
	method: 'GET',
	headers: {
		q: 'sabotage besatie boys',
		client_id: 'nzlp05ChzxSyVpcOCKvTIZdwDLZfWM0z',
		limit: '1',
		offset: '0',
		linked_partitioning: '1',
		app_version: '1638455582',
		app_locale: 'en',
	},
}
console.log(testOptions)
const request = https.request(testOptions, res => {
	console.log(`statusCode: ${res.statusCode}`)

	res.on('data', d=> {
		process.stdout.write(d)
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
