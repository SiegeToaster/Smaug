import { CommandInteraction } from "discord.js"
import { SlashCommandBuilder } from '@discordjs/builders'

export const commandData = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with pong.')

export default function ping(interaction: CommandInteraction): void {

	interaction.reply('pong.')	
}
