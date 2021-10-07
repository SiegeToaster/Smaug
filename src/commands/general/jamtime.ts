import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js"
import { SlashCommandBuilder, SlashCommandBooleanOption, SlashCommandIntegerOption } from '@discordjs/builders'

let startTime: number

export const commandData = new SlashCommandBuilder()
	.setName('jamtime')
	.setDescription('Request a jamtime.')
	.addBooleanOption((option: SlashCommandBooleanOption): SlashCommandBooleanOption => {
		return option.setName('timeout')
			.setDescription('Set a timeout?')
	})
	.addIntegerOption((option: SlashCommandIntegerOption): SlashCommandIntegerOption => {
		return option.setName('time')
			.setDescription('Amount of time for timeout (minutes).  This will automatically set timeout to true.  Default 5.')
	})

export default async function jamtime(interaction: CommandInteraction): Promise<void> {
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
	}).then(rpl => {
		setTimeout(() => rpl.delete(), 10000) //! find delete function
	})

	startTime = Date.now()
	//ToDo: send message (and later join music channel) when everyone reacts yes; finish timeout; remove previous question if another triggered
}

export function jamtimeYesButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> present jammer`)
	console.log(startTime)
}

export function jamtimeNoButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> absent jammer`)
}
