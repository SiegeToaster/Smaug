import {
	CommandInteraction,
	VoiceChannel,
} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { AudioPlayer, createAudioPlayer } from '@discordjs/voice'
import { musicFunctions } from '../../functions/functionExports'
// https://github.com/discordjs/voice/blob/main/examples/basic/

const player = createAudioPlayer()

export const commandData = new SlashCommandBuilder()
	.setName('joinvoice')
	.setDescription('Join voice channel.')

export default async function joinVoice(interaction: CommandInteraction, sendMessage?: boolean): Promise<AudioPlayer | void> {
	const player = createAudioPlayer()
	// @ts-expect-error memeber will (hopefully) never be type APIInteractionGuildMember
	const channel: VoiceChannel | null | undefined = interaction.member?.voice.channel
	if (!channel) return await interaction.reply('No voice channel detected.  Join a voice channel and try again.')

	try {
		const connection = await musicFunctions.connectToChannel(channel)
		connection.subscribe(player)
		if (sendMessage) await interaction.reply('Joining channel')
	} catch (err) {
		console.error('joinVoice connection error: ', err)
	}

	return player
} // ToDo: play songs other than the techno thing
