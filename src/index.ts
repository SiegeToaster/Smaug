import { Client, Intents } from "discord.js"
import { config } from 'dotenv'
config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
	console.log('Smaug is now online.')
	console.log('')
})

let interaction
export { interaction }

import ping from './commands/general/ping'
import catjam from './commands/general/catjam'
import jamtime from './commands/general/jamtime'

import { jamtimeYesButton } from './commands/general/jamtime'
import { jamtimeNoButton } from './commands/general/jamtime'

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
	}
})

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return

	console.log(`\nButton: ${interaction.customId}`)
	switch (interaction.customId) {
	case 'yesButton': {
		jamtimeYesButton(interaction)
		break
	}

	case 'noButton': {
		jamtimeNoButton(interaction)	
		break
	}
	}

})
