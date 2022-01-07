import { Collection, CommandInteraction, GuildMember, Snowflake } from 'discord.js'
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders'

export const commandData = new SlashCommandBuilder()
	.setName('absent')
	.setDescription('Check who is absent in the server.')
	.addStringOption((option: SlashCommandStringOption): SlashCommandStringOption => {
		return option.setName('user')
			.setDescription('User/Role to specifically check.')
	})

export default async function absent(interaction: CommandInteraction): Promise<void> {
	let allUsers: Collection<Snowflake, GuildMember | undefined> | undefined = new Collection()
	let allUsersStringArr = [interaction.options.getString('user')?.trim()]

	if (allUsersStringArr[0]) { // ToDo: add functionality for roles
		allUsersStringArr = allUsersStringArr[0].split(',')
		for (let user of allUsersStringArr) {
			if (!user) continue
			user = user.trim()
			if (user.length !== 22 || !user.match(/<@![0-9]+>/g /* RegExp for a user mention */)) continue
			// ToDo: log invalid users to string and add to reply.
			user = user.slice(3, 21)
			allUsers.set(user, await interaction.guild?.members.fetch(user))
		}
		// ToDo: if length of allUsers is still 0 (i.e, only invalid arguments passed), run the else code
	} else {
		allUsers = await interaction.guild?.members.fetch()
		allUsers = allUsers?.filter(user => !user?.user.bot)
	}

	if (!allUsers || allUsers.size < 1) {
		interaction.reply('Failed to fetch server members.')

		return console.error('absent error: failed to fetch guild members - allUsers undefined')
	}
	
	const offlineUsers: string[] = []
	for (let i = 0; i < allUsers.size; i++) {
		const user = allUsers.at(i)
		if (!user) continue
		if (!user.presence) { // I *think* null presence means offline
			offlineUsers.push(user.nickname ? user.nickname : user.user.username)
			continue
		}
		if (user.presence.status === 'online' || user.presence.status === 'dnd') continue

		offlineUsers.push(user.nickname ? user.nickname : user.user.username)
	}

	switch (offlineUsers.length) {
		case 0: {
			interaction.reply('No one is absent.')
			break
		}

		case 1: {
			interaction.reply(`${offlineUsers[0]} is absent.`)
			break
		}

		case 2: {
			interaction.reply(`${offlineUsers[0]} and ${offlineUsers[1]} are absent`)
			break
		}

		default: {
			let str = ''
			str += offlineUsers.shift()

			for (const i in offlineUsers) {
				if (offlineUsers.length - 1 === parseInt(i)) {
					str += `, and ${offlineUsers[i]}`
				} else {
					str += `, ${offlineUsers[i]}`
				}
			}

			interaction.reply(`${str} are absent`)
			break
		}
	}
}
