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
