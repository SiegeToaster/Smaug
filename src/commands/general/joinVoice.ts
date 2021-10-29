import {
	CommandInteraction,
	VoiceChannel,
} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { createAudioPlayer } from '@discordjs/voice'
import { musicFunctions } from './../../functions/functionExports'
// https://github.com/discordjs/voice/blob/main/examples/basic/

const player = createAudioPlayer()

export const commandData = new SlashCommandBuilder()
	.setName('joinvoice')
	.setDescription('Join voice channel.')

export default async function joinVoice(interaction: CommandInteraction): Promise<void> {
	const player = createAudioPlayer()
	// @ts-expect-error memeber will (hopefully) never be type APIInteractionGuildMember
	const channel: VoiceChannel | null | undefined = interaction.member?.voice.channel
	if (!channel) return interaction.reply('No voice channel detected.  Join a voice channel and try again.')

	try {
		const connection = await musicFunctions.connectToChannel(channel)
		connection.subscribe(player)
		interaction.reply('Playing.')
	} catch (err) {
		console.error('joinVoice connection error: ', err)
	}

	musicFunctions.playSong(player)
} // ToDo: play songs other than the techno thing
