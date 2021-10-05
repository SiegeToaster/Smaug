/* // import { CommandInteraction } from "discord.js"
// import { SlashCommandBuilder } from '@discordjs/builders'
//! remove all of this, just make it type SlashCommandBuilder, or export the slashcommandbuilder from file


interface optionsInterface {
	type: 1|2|3
	name: Lowercase<string>
	description: string
	required?: boolean
	choices?: {name: string, value: string}[]
}

export class commandClass {
	name: string
	description: string
	options: optionsInterface[]


	constructor(name: string, description: string) {
		this.name = name
		this.description = description
	}
}
 */
