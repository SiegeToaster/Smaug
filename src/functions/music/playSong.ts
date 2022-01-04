import {
	createAudioResource,
	AudioPlayer,
	StreamType,
	AudioPlayerStatus,
	entersState,
} from '@discordjs/voice'
import { URL } from 'url'

export default async function playSong(player: AudioPlayer, song: string): Promise<AudioPlayer | void> {
	let url: URL
	try {
		url = new URL(song)
	} catch (err) {
		// await used to get Promise<void> return type
		return await console.error('playsong new URL error: ', err)
	}
	// console.log(url.toJSON()) // DEBUG

	const resource = createAudioResource(url.toJSON(), {
		inputType: StreamType.Arbitrary,
	})

	player.play(resource)

	return entersState(player, AudioPlayerStatus.Playing, 5e3)
}
