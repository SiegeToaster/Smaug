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

client.login(process.env.DISCORD_TOKEN)

client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return

	console.log(`Command: ${interaction.commandName}`)
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
	}
	}
})

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return
	console.log(interaction)

	/* switch (interaction) {

	} */

})
