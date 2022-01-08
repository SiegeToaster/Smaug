import {
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js"

import {
	SlashCommandBuilder,
	SlashCommandBooleanOption,
	SlashCommandIntegerOption,
} from '@discordjs/builders'


import { utilityFunctions } from '../../functions/functionExports'

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

let jammersString = '\u200b'
let nonJammersString = '\u200b'

// @ts-expect-error not dealing with stupid types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const filter = (interaction) => interaction.customId === 'yesButton' || interaction.customId === 'noButton'
export default async function jamtime(interaction: CommandInteraction): Promise<void> {
	
	// @ts-expect-error checks for null
	let timeoutTime: number = (interaction.options.getInteger('time') ? interaction.options.getInteger('time') * 60 : -1)
	const hasTimeout: boolean = (interaction.options.getBoolean('timeout') ? true : (timeoutTime != -1 ? true : false))
	if (timeoutTime === -1 && hasTimeout) timeoutTime = 600

	console.log(`hasTimeout: ${hasTimeout} - timeoutTime: ${timeoutTime}`)

	jammersString = '\u200b'
	nonJammersString = '\u200b'

	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('yesButton')
				.setLabel('Yes')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('noButton')
				.setLabel('No')
				.setStyle('DANGER'),
		)

	let embedsArray: MessageEmbed[] = [
		new MessageEmbed(),
	]

	const collector = interaction.channel?.createMessageComponentCollector({ filter })
	collector?.on('collect', async i => {
		switch (i.customId) {
			case 'yesButton': {
				const userReacted = !(jammersString.search(`${i.user.id}`) !== -1 || nonJammersString.search(`${i.user.id}`) !== -1)
				if (userReacted) {
					jammersString == '\u200b' ?
						jammersString = `<@!${i.user.id}>` :
						jammersString += `\n<@!${i.user.id}>`
				}
			
				embedsArray = [new MessageEmbed()]
				if (hasTimeout) embedsArray[0].addField('Timeout Time Remaining:', `${utilityFunctions.secondsToMinutes(timeoutTime, true)}`)
				embedsArray[0]
					.addField('Present Jammers:', `${jammersString}`, true)
					.addField('Absent Jammers:', `${nonJammersString}`, true)
			
				await i.update({
					content: `@everyone jamtime?`,
					components: [row],
					embeds: embedsArray,
				})

				if (userReacted)
					await i.followUp(`<@!${i.user.id}> Present Jammer`)

				if (jammersString == '\u200b' ? 0 : jammersString.split('\n').length >= (await utilityFunctions.countGuildMembers(interaction.guild)))
					await i.followUp('@everyone reacted yes.')

				break
			}
	
			case 'noButton': {
				const userReacted = !(jammersString.search(`${i.user.id}`) !== -1 || nonJammersString.search(`${i.user.id}`) !== -1)
				if (userReacted) {
					nonJammersString == '\u200b' ?
						nonJammersString = `<@!${i.user.id}>` :
						nonJammersString += `\n<@!${i.user.id}>`
				}
			
				embedsArray = [new MessageEmbed()]
				if (hasTimeout) embedsArray[0].addField('Timeout Time Remaining:', `${utilityFunctions.secondsToMinutes(timeoutTime, true)}`)
				embedsArray[0]
					.addField('Present Jammers:', `${jammersString}`, true)
					.addField('Absent Jammers:', `${nonJammersString}`, true)
			
				await i.update({
					content: `@everyone jamtime?`,
					components: [row],
					embeds: embedsArray,
				})

				if (userReacted)
					await i.followUp(`<@!${i.user.id}> Absent Jammer`)

				break
			}
		}
	})

	interaction.reply({
		content: '@everyone jamtime?',
		components: [row],
	})

	if (hasTimeout) {
		(async (): Promise<void> => {
			while (timeoutTime > 0) {
				await utilityFunctions.timer(1000)
				timeoutTime--
			}
			if (interaction.replied) interaction.deleteReply()
		})
	}

	//ToDo: join music channel when everyone reacts yes; remove previous question if another triggered
}
