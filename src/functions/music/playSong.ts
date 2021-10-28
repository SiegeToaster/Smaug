import {
	createAudioResource,
	AudioPlayer,
	StreamType,
	AudioPlayerStatus,
	entersState,
} from '@discordjs/voice'

export default function playSong(player: AudioPlayer): Promise<AudioPlayer> {
	const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
		inputType: StreamType.Arbitrary,
	})

	player.play(resource)

	return entersState(player, AudioPlayerStatus.Playing, 5e3)
}
