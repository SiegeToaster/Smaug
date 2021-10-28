import {
	CommandInteraction,
	VoiceChannel,
	StageChannel,
} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import {createAudioPlayer} from '@discordjs/voice'
import { musicFunctions } from './../../functions/functionExports'
// https://github.com/discordjs/voice/blob/main/examples/basic/

const player = createAudioPlayer()

export const commandData = new SlashCommandBuilder()
	.setName('joinvoice')
	.setDescription('Join voice channel.')

export default function joinVoice(interaction: CommandInteraction): void {
	const player = createAudioPlayer()
	// @ts-expect-error memeber will (hopefully) never be type APIInteractionGuildMember
	const channel: VoiceChannel | StageChannel | null | undefined = interaction.member?.voice.channel
	if (!channel) return console.error('joinVoice error: channel is null or undefined:\n', channel)
}

async function yaboi(message) {
	if (message.content === '-join') {
		const channel = message.member?.voice.channel

		if (channel) {
			try {
				const connection = await musicFunctions.connectToChannel(channel)
				connection.subscribe(player)
				message.reply('Playing now!')
			} catch (error) {
				console.error(error)
			}
		} else {
			message.reply('Join a voice channel then try again!')
		}
	}
}
