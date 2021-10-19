import {
	ButtonInteraction,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	User,
	GuildMember,
	// Message,
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
let jammersString = ' '
const nonJammers: User[] = []
let nonJammersString = ' '

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

	updateJammerString()
	let embedsArray: MessageEmbed[] = [
		new MessageEmbed()
			.addField('Present Jammers:', `${jammersString}`, true)
			.addField('Absent Jammers:', `${nonJammersString}`, true),
	]

	interaction.reply({
		content: '@everyone jamtime?',
		components: [row],
	})

	;(async (): Promise<void> => {
		let tempCount = 0
		;(await interaction.guild?.members.fetch())?.forEach((member: GuildMember) => {
			if (!member.user.bot) tempCount++
		})
		console.log(tempCount)
	})()

	if (hasTimeout) {
		(async (): Promise<void> => {
			while (timeoutTime > 0) {
				if (interaction.replied) {
					try {
						updateJammerString()
						embedsArray = [new MessageEmbed()
							.addField('Timeout Time Remaining:', `${utilityFunctions.secondsToMinutes(timeoutTime, true)}`)
							.addField('Present Jammers:', `${jammersString}`, true)
							.addField('Absent Jammers:', `${nonJammersString}`, true)]
						
						interaction.editReply({
							content: `@everyone jamtime?`,
							components: [row],
							embeds: embedsArray,
						})
					} catch (error) {
						console.error('jamtime while-edit error: ', error)
					}
				}
				await utilityFunctions.timer(1000)
				timeoutTime--
			}
			if (interaction.replied) interaction.deleteReply()
		})()
	} else {
		// ToDo: embed to display reacted users
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

function updateJammerString(): void {
	jammers.forEach((jammer: User) => {
		jammersString += `${jammer}\n`
	})

	nonJammers.forEach((nonJammer: User) => {
		nonJammersString += `${nonJammer}\n`
	})
}
