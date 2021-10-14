import { config } from 'dotenv'
config()
import { REST } from '@discordjs/rest'
import { APIApplicationCommandOption, Routes } from 'discord-api-types'
import * as commandExports from './commands/commandExports'

// eslint-disable-next-line camelcase
// const commands: { name: Lowercase<string>, description: string, options: APIApplicationCommandOption[], default_permission: boolean | undefined }[] = []
const commands = [] // ToDo: figure out the tyeps for this
let command: keyof typeof commandExports
for (command in commandExports) {
	// console.log(commandExports[command].toJSON()) // DEBUG
	commands.push(commandExports[command].toJSON())
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)

console.log('Commands to be inputted:')
console.log(commands)

;(async (): Promise<void> => {
	try {
		console.log('Started refreshing application (/) commands.')
	
		await rest.put(
			Routes.applicationGuildCommands('873793725875232798', '867233761364148245'),
			{ body: commands },
		)
	
		console.log('Successfully reloaded application (/) commands.')
	} catch (error) {
		console.error(error)
	}
})()
