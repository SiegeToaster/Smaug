export abstract class BaseCommand {
	public readonly builder: SlashCommandBuilder

	constructor(builder: SlashCommandBuilder) {
		this.builder = builder
	}

	public handler(i: CommandInteraction): void {

	}
}
