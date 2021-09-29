import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { BaseCommand } from './../commandClasses'

const data = new SlashCommandBuilder()
	.setName('catjam')
	.setDescription('Sends cat gif.')

export default function catjam(interaction: CommandInteraction): void {	
	interaction.reply('https://tenor.com/view/cat-cat-jam-nod-pet-kitty-gif-17932554')
}
