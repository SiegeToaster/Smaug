import { config } from 'dotenv'
config()
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import readline from 'readline'
// const { SlashCommandBuilder } = require('@discordjs/builders');
// https://discordjs.guide/popular-topics/builders.html#commands

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)
const commands: Record<string, string>[] = []

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
	await new Promise(async outerResolve => {
		for (let i = 0; i < numOfCommands; i++) {
			// console.log(i.toString())
			await new Promise(innerResolve => {
				rl.question('Command Name: ', nameInput => {
					nameInput = nameInput.toLowerCase()
					rl.question('Command Description: ', descriptionInput => {
						commands[i] = {}
						commands[i].name = nameInput
						commands[i].description = descriptionInput
						// console.log(commands)
						innerResolve(true)
						// console.log('innerResolve')
					})
				})
			})
		}
		outerResolve(true)
		// console.log('outer resolve')
		rl.close()
	})

	console.log('commands inputted')
	console.log(commands)
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
})
