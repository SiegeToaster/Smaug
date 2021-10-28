import { DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods } from '../../'
import { VoiceChannel, Snowflake, Client, Constants } from 'discord.js'

const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>()
const trackedClients = new Set<Client>()

export function createDiscordJSAdapter(channel: VoiceChannel): DiscordGatewayAdapterCreator {
	return (methods) => {
		adapters.set(channel.guild.id, methods)
		trackClient(channel.client)
		trackGuild(channel.guild)

		return {
			sendPayload(data) {
				if (channel.guild.shard.status === Constants.Status.READY) {
					channel.guild.shard.send(data)

					return true
				}

				return false
			},
			destroy() {
				return adapters.delete(channel.guild.id)
			},
		}
	}
}