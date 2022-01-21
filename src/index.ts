import { Client } from "discord.js"
import { AudioPlayer } from "@discordjs/voice"
import { config } from 'dotenv'
config()
import mysql from 'mysql2' // original package doesn't support SHA-256 login, don't really need security but oh well

const client = new Client({ 
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
})
let player: AudioPlayer | void | undefined

const sqlConnection = mysql.createConnection({
	host: "127.0.0.1",
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: "smaug",
})

let sqlReady

client.once('ready', () => {
	console.log('Smaug is now online.\n')
	sqlConnection.connect(async err => {
		if (err) return console.error(new Error(`Failed to connect to SQL\nRecommend the error be fixed and the bot be restarted\n\n${err}`))
		console.log("SQL Connected Successfully\n")
		
		sqlReady = utilityFunctions.initSQL(client, sqlConnection)
	})
	
})


let interaction
export { interaction }

import absent from './commands/general/absent'
import catjam from './commands/general/catjam'
import ping from './commands/general/ping'
import jamtime from './commands/music/jamtime'
import joinVoice from './commands/music/joinVoice'
import play from './commands/music/play'
import { utilityFunctions } from "./functions/functionExports"

client.login(process.env.DISCORD_TOKEN)

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return

	console.log(`\nCommand: ${interaction.commandName}`)
	switch (interaction.commandName) {
		case 'absent': {
			absent(interaction)
			break
		}


		case 'catjam': {
			catjam(interaction)
			break
		}
		
		case 'ping': {
			ping(interaction)
			break
		}

		case 'jamtime': {
			jamtime(interaction)
			break
		}

		case 'joinvoice': {
			player = await joinVoice(interaction, true)
			break
		}

		case 'play': {
			play(interaction, player)
			break
		}
	}
})
