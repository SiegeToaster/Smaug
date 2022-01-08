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
	let invalidInputs = ''

	if (allUsersStringArr[0]) {
		invalidInputs = 'Some of the requested users are invalid:\n' // string is length 41
		allUsersStringArr = allUsersStringArr[0].split(',')

		for (let user of allUsersStringArr) {
			if (!user) continue
			user = user.trim()
			if (user.length !== 22 || !(user.match(/<@![0-9]+>/g /* RegExp for a user mention */) || user.match(/<@&[0-9]+>/ /* RegExp for a role mention */))) {
				invalidInputs += `${user},\n`

				continue
			}

			user = user.slice(3, 21)
			try {
				if (user.match(/<@![0-9]+>/g /* RegExp for a user mention */)) {
					allUsers.set(user, await interaction.guild?.members.fetch(user))
				} else {
					const roleMembers: Collection<Snowflake, GuildMember> | undefined = (await interaction.guild?.roles.fetch(user))?.members
					if (!roleMembers) throw new Error('Undefined role members')
					allUsers = allUsers.concat(roleMembers)
				}
			} catch (err) {
				interaction.reply('Failed to fetch server members.')

				return console.error(`absent error: failed to fetch guild member/role id: ${user} - ${err}`)
			}
		}
		
		if (invalidInputs.length === 41) {
			invalidInputs = ''
		} else {
			invalidInputs = invalidInputs.slice(0, invalidInputs.length - 2)
		}
	}

	if (allUsers.size === 0) {
		allUsers = await interaction.guild?.members.fetch()
		allUsers = allUsers?.filter(user => !user?.user.bot)
	}

	if (!allUsers) {
		interaction.reply('Failed to fetch server members.')

		return console.error('absent error: failed to fetch guild members - allUsers undefined')
	}
	
	const offlineUsers: string[] = []
	for (const user of allUsers.values()) {
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
			interaction.reply(`${invalidInputs}\n\nNo one is absent.`)
			break
		}

		case 1: {
			interaction.reply(`${invalidInputs}\n\n${offlineUsers[0]} is absent.`)
			break
		}

		case 2: {
			interaction.reply(`${invalidInputs}\n\n${offlineUsers[0]} and ${offlineUsers[1]} are absent`)
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

			interaction.reply(`${invalidInputs}\n\n${str} are absent`)
			break
		}
	}
}
