import {
	CommandInteraction,
	Client,
	VoiceChannel,
	Intents,
} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice'
// import { createDiscordJSAdapter } from './adapter';
// https://github.com/discordjs/voice/blob/main/examples/basic/

const player = createAudioPlayer()

export const commandData = new SlashCommandBuilder()
	.setName('joinvoice')
	.setDescription('Join voice channel.')

export default function joinVoice(interaction: CommandInteraction): void {

	interaction.reply('join voice command')
}
