import { config } from 'dotenv'
config()
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

const commands = [{
	name: 'ping',
	description: 'Replies with Pong!',
}]

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async (): Promise<void> => {
	try {
		console.log('Started refreshing application (/) commands.')

		await rest.put(
			Routes.applicationGuildCommands('873793725875232798', '867233761364148245'),
			// APP ID= '873793725875232798' (same as client?)
			{ body: commands },
		)

		console.log('Successfully reloaded application (/) commands.')
	} catch (error) {
		console.error(error)
	}
})()
