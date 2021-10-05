import { config } from 'dotenv'
config()
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
// const { SlashCommandBuilder } = require('@discordjs/builders');
// https://discordjs.guide/popular-topics/builders.html#commands

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)
// import { data } from './../src/index'

const commands: Record<string, string>[] = [
	{
		name: 'ping',
		description: 'replies with pong.',
	},

	{
		name: 'catjam',
		description: 'sends cat gif.',
	},
]

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
