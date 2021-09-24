import { Client, Intents } from "discord.js"
import { config } from 'dotenv'
config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
	console.log('Smaug is now online.')
})

client.login(process.env.DISCORD_TOKEN)

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return

	console.log(interaction.commandName)
	switch (interaction.commandName) {
	case 'ping': {
		await interaction.reply('pong.')
	}
	}
})
