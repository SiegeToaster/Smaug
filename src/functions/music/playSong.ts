import {
	createAudioResource,
	AudioPlayer,
	StreamType,
	AudioPlayerStatus,
	entersState,
} from '@discordjs/voice'
import { URL } from 'url'

export default function playSong(player: AudioPlayer, song: string, isUrl: boolean): Promise<AudioPlayer> | void {
	let url: URL
	try {
		url = new URL(song)
	} catch (err) {
		return console.log(err)
	}
	console.log(url.toJSON())

	const resource = createAudioResource(url.toJSON(), {
		inputType: StreamType.Arbitrary,
	})

	player.play(resource)

	return entersState(player, AudioPlayerStatus.Playing, 5e3)
}
