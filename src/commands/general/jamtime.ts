import {
	ButtonInteraction,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	User,
} from "discord.js"

import {
	SlashCommandBuilder,
	SlashCommandBooleanOption,
	SlashCommandIntegerOption,
} from '@discordjs/builders'

import { default as utilityFunctions } from './../../functions/functionExports'


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

const jammers: User[] = []
const nonJammers: User[] = []

export default async function jamtime(interaction: CommandInteraction): Promise<void> {
	
	// @ts-expect-error checks for null
	let timeoutTime: number = (interaction.options.getInteger('time') ? interaction.options.getInteger('time') * 60 : -1)
	const hasTimeout: boolean = (interaction.options.getBoolean('timeout') ? true : (timeoutTime != -1 ? true : false))
	if (timeoutTime === -1 && hasTimeout) timeoutTime = 600

	console.log(`hasTimeout: ${hasTimeout} - timeoutTime: ${timeoutTime}`)
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
				await utilityFunctions.timer(1000)
				timeoutTime--
			}
		})()

		;(async (): Promise<void> => {
			while (timeoutTime > 0) {
				if (interaction.replied) {
					try {
						embedsArray = [new MessageEmbed()
							.addField('Timeout Time Remaining:', `${utilityFunctions.secondsToMinutes(timeoutTime, true)}`)]
						
						interaction.editReply({
							content: `@everyone jamtime?`,
							components: [row],
							embeds: embedsArray,
						})
					} catch (error) {
						console.error('jamtime while-edit error: ', error)
					}
				}
				await utilityFunctions.timer(500)
			}
		})()
	}

	//ToDo: send message (and later join music channel) when everyone reacts yes; remove previous question if another triggered
}

export function jamtimeYesButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> present jammer`)
	jammers.push(interaction.user)
}

export function jamtimeNoButton(interaction: ButtonInteraction): void {
	interaction.reply(`<@!${interaction.user.id}> absent jammer`)
	nonJammers.push(interaction.user)
}
