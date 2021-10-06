import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js"
import { SlashCommandBuilder } from '@discordjs/builders'

export const commandData = new SlashCommandBuilder()
	.setName('jamtime')
	.setDescription('Request a jamtime.')

export default function jamtime(interaction: CommandInteraction): void {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('yesButton')
				.setLabel('Yes')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('noButton')
				.setLabel('No')
				.setStyle('PRIMARY'),
		)
	interaction.reply({
		content: '@everyone jamtime?',
		components: [row],
	})
	//ToDo: create buttons for yes and no; reply present/absent jammer; join music channel once everyone reacts yes (and maybe timeout)
}

export function jamtimeYesButton(interaction: ButtonInteraction): void {
	// @ts-expect-error interaction.member is not null
	console.log(interaction.member.nickname ? interaction.member.nickname : interaction.member.user.username)
	
	// interaction.reply(`${interaction.member.nickname ? interaction.member.nickname : interaction.user.username} present jammer`)
}

export function jamtimeNoButton(interaction: ButtonInteraction): void {
	// @ts-expect-error interaction.member is not null
	console.log(interaction.member.nickname ? interaction.member.nickname : interaction.member?.user.username)
	
	// interaction.reply(`${interaction.member.nickname ? interaction.member.nickname : interaction.user.username} absent jammer`)
}
