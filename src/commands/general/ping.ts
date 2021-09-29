import { CommandInteraction } from "discord.js"

export default function ping(interaction: CommandInteraction): void {

	interaction.reply('pong.')	
}
