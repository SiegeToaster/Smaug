import { VoiceChannel } from "discord.js"
import {
	VoiceConnection,
	joinVoiceChannel,
	entersState,
	VoiceConnectionStatus,
} from "@discordjs/voice"
import { musicFunctions } from "../functionExports"

export default async function connectToChannel(channel: VoiceChannel): Promise<VoiceConnection> {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: musicFunctions.createDiscordJSAdapter(channel),
	})

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3)

		return connection
	} catch (error) {
		connection.destroy()
		throw error
	}
}
