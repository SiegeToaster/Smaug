import { CommandInteraction } from 'discord.js'
import {
	SlashCommandBuilder,
	SlashCommandStringOption,
} from '@discordjs/builders'
import { AudioPlayer } from '@discordjs/voice'
import { musicFunctions } from './../../functions/functionExports'
import { utilityFunctions } from './../../functions/functionExports'
import joinVoice from './joinVoice'

export const commandData = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play song.')
	.addStringOption((option: SlashCommandStringOption): SlashCommandStringOption => {
		return option.setName('song')
			.setDescription('Song name/url')
			.setRequired(true)
	})


export default async function play(interaction: CommandInteraction, player: AudioPlayer | void): Promise<void> {
	if (!player) player = await joinVoice(interaction, false)
	if (!player) {
		await interaction.reply('Unable to join voice channel or fetch channel info')

		return console.error('play player undefined error')
	}

	const requestedSong = interaction.options.getString('song')
	if (!requestedSong) return await interaction.reply('No song found')

	if (utilityFunctions.isUrl(requestedSong)) {
		const playSongReturn = await musicFunctions.playSong(player, requestedSong, true)
		if (playSongReturn) return await interaction.reply('Playing song')

		interaction.reply('could not play song')

		return console.error('play error: could not play song')
	}
	
	return await interaction.reply('idk how to search for songs')
}
