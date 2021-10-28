import { Client } from "discord.js"
import { config } from 'dotenv'
config()

const client = new Client({ 
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
})

client.once('ready', () => {
	console.log('Smaug is now online.')
	console.log('')
})

let interaction
export { interaction }

import ping from './commands/general/ping'
import catjam from './commands/general/catjam'
import jamtime from './commands/general/jamtime'
import joinVoice from './commands/general/joinVoice'

client.login(process.env.DISCORD_TOKEN)

client.on('interactionCreate', interaction => {
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
		joinVoice(interaction)
		break
	}
	}
})
