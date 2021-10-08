import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js"
import { SlashCommandBuilder, SlashCommandBooleanOption, SlashCommandIntegerOption } from '@discordjs/builders'

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
	let timeoutTime: number = (interaction.options.getInteger('time') ? interaction.options.getInteger('time') * 60 : -1)
	const hasTimeout: boolean /* Null will never occur after check on next line */ = (interaction.options.getBoolean('timeout') ? true : (timeoutTime != -1 ? true : false))
	if (timeoutTime === -1 && hasTimeout) timeoutTime = 600

	console.log(`hasTimeout: ${hasTimeout}; timeoutTime: ${timeoutTime}`)
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

	if (hasTimeout) {
		setTimeout(() => {
			try {
				interaction.deleteReply()
			} catch (error) {
				console.error('jamtime timeout error: ', error)
			}
		}, timeoutTime * 1000)
	}

	//ToDo: send message (and later join music channel) when everyone reacts yes; finish timeout; remove previous question if another triggered
}

export function jamtimeYesButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> present jammer`)
}

export function jamtimeNoButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> absent jammer`)
}
