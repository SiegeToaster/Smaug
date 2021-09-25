import { config } from 'dotenv'
config()
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import readline from 'readline'

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)
let commands: Record<string, string>[] = []

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})
let numOfCommands: number

rl.question('How many commands are you adding/updating?  Natural Number: ', async (commandsNum: string) => {
	numOfCommands = parseInt(commandsNum)
	if (numOfCommands < 1 || isNaN(numOfCommands)) {
		console.log('invalid amount of commands')
		process.exit(1)
	}
	for (let i = 0; i < numOfCommands; i++) {
		let forDone: boolean
		rl.question('Command Name: ', nameInput => {
			rl.question('Command Description: ', descriptionInput => {
				rl.close()
				commands[i] = {}
				commands[i].name = nameInput
				commands[i].description = descriptionInput
				console.log(commands)
				forDone = true
			})
		})
		await forDone
	}
	console.log(commands)/*
	;(async (): Promise<void> => {
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
	*/
})
