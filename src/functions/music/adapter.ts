import {
	GatewayVoiceServerUpdateDispatchData,
	GatewayVoiceStateUpdateDispatchData,
} from 'discord-api-types/v9'

export interface DiscordGatewayAdapterLibraryMethods {
	/**
	 * Call this when you receive a VOICE_SERVER_UPDATE payload that is relevant to the adapter.
	 *
	 * @param data - The inner data of the VOICE_SERVER_UPDATE payload
	 */
	onVoiceServerUpdate(data: GatewayVoiceServerUpdateDispatchData): void
	/**
	 * Call this when you receive a VOICE_STATE_UPDATE payload that is relevant to the adapter.
	 *
	 * @param data - The inner data of the VOICE_STATE_UPDATE payload
	 */
	onVoiceStateUpdate(data: GatewayVoiceStateUpdateDispatchData): void
	/**
	 * Call this when the adapter can no longer be used (e.g. due to a disconnect from the main gateway)
	 */
	destroy(): void
}

export interface DiscordGatewayAdapterImplementerMethods {
	/**
	 * Implement this method such that the given payload is sent to the main Discord gateway connection.
	 *
	 * @param payload - The payload to send to the main Discord gateway connection
	 * @returns false if the payload definitely failed to send - in this case, the voice connection disconnects.
	 */
	sendPayload(payload: never): boolean
	/**
	 * This will be called by @discordjs/voice when the adapter can safely be destroyed as it will no
	 * longer be used.
	 */
	destroy(): void
}

export type DiscordGatewayAdapterCreator = (
	methods: DiscordGatewayAdapterLibraryMethods,
) => DiscordGatewayAdapterImplementerMethods
