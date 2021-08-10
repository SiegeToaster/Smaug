import { config } from 'dotenv'
import { Client } from 'eris'
config()
const bot = new Client(process.env.TOKEN)

bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.username}`)
})
bot.on('messageCreate', (message) => {
    if (message.content.toLocaleLowerCase() === "?ping") {
        bot.createMessage(message.channel.id, "pong")
    }
})

bot.connect()
