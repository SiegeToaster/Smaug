import { Guild } from "discord.js"

export default async function countGuildMembers(guild: Guild | null): Promise<number> {
	let memberCount = 0
	if (!guild) return -1
	;(await guild?.members.fetch())?.forEach(member => {
		if (!member.user.bot) memberCount++
	})

	return memberCount
}
