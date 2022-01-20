import { Client } from 'discord.js'
import mysql from 'mysql2'

export default async function initSQL(client: Client<boolean>	, sqlConnection: mysql.Connection): Promise<void | boolean> {
	sqlConnection.connect(async err => {
		if (err) return console.error(new Error(`Failed to connect to SQL\nRecommend the error be fixed and the bot be restarted\n\n${err}`))
		console.log("SQL Connected Successfully\n")
		
		sqlConnection.query('CREATE TABLE IF NOT EXISTS songQueue (guildID VARCHAR(18), queue JSON)', (error, result) => {
			// queue JSON format should be {currentIndex: number, 1 (-1 for none): song1, ..., n: songn}
			if (error) return console.error(new Error(`SQL query error: create songQueue table\n${error}`))
			// insert into table the guild id and json format
		})
		const guildIDsArray: string[] = Array.from((await client.guilds.fetch()).keys())
		const newguilds = String(...guildIDsArray)
		// console.log(newguilds) // DEBUG

		// filter out guildIDs that already have rows
		sqlConnection.query(`SELECT * FROM songQueue WHERE guildID in (${newguilds})`, (error, result) => {
			if (error) return console.error(new Error(`SQL query error: fetch songQueue guildIDs\n${error}`))			
			if (result !== [] && !(Symbol.iterator in Object(result))) return console.error(new Error(`SQL query error: improper result type - result: ${result}`))
			const presentGuilds: string[] = []
			
			// @ts-expect-error some types of result are not iteratable, but is checked above
			for (const guild of result) {
				presentGuilds.push(guild.guildID)
			}
			const guildsToAdd: string[] = guildIDsArray.filter(guild => !presentGuilds.includes(guild))
			
			if (guildsToAdd.length <= 0) return
			
			const valuesArr: string[] = []
			for (const guild of guildsToAdd) {
				valuesArr.push(`('${guild}', '{"currentIndex": -1}')`)
			}
			const values = valuesArr.join(', ')
			// console.log(values) // DEBUG

			sqlConnection.query(`INSERT INTO songQueue (guildID, queue) VALUES ${values}`, (error1, result1) => {
				if (error1) return console.error(new Error(`SQL query error: insert new guild into songQueue\n${error1}`))
			})
		})

		return true
	})
}
