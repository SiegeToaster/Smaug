import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
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
	const timer = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms))

	// @ts-expect-error checks for null
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
	let embedsArray: MessageEmbed[] = []

	interaction.reply({
		content: '@everyone jamtime?',
		components: [row],
	})

	if (hasTimeout) {
		embedsArray = [new MessageEmbed()
			.addField('Timeout Time Remaining:', `${timeoutTime}`)]
		setTimeout(() => {
			try {
				interaction.deleteReply()
			} catch (error) {
				console.error('jamtime timeout error: ', error)
			}
		}, timeoutTime * 1000)

		;(async (): Promise<void> => {
			while (timeoutTime > 0) {
				await timer(1000)
				timeoutTime--
			}
		})()

		;(async (): Promise<void> => {
			let whileTestVar = 0
			while (timeoutTime > 0) {
				console.log(`passes: ${whileTestVar}`)
				if (whileTestVar % 10 === 0) console.log(`hasReplied: ${interaction.replied}\n`)
				whileTestVar++
				if (interaction.replied) {
					if (whileTestVar % 10 === 0) console.log('AW YEP!')
					try {
						console.log(timeoutTime)
						embedsArray = [new MessageEmbed()
							.addField('Timeout Time Remaining:', `${timeoutTime}`)]
						
						if (whileTestVar % 10 === 0) console.log(embedsArray[0])
						interaction.editReply({
							content: `@everyone jamtime? ${timeoutTime}`,
							components: [row],
							embeds: embedsArray,
						})
					} catch (error) {
						console.error('jamtime while-edit error: ', error)
					}
				}
				await timer(500)
			}
		})()
	}

	//ToDo: send message (and later join music channel) when everyone reacts yes; remove previous question if another triggered
}

export function jamtimeYesButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> present jammer`)
}

export function jamtimeNoButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> absent jammer`)
}
