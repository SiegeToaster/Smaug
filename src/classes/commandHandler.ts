import Eris from 'eris'
import { EventEmitter } from 'stream'
import path from 'path'
import fs from 'fs'
import {
    BaseCommand,
} from './baseCommand'

export class templateCommand extends BaseCommand {
    private  bot: Eris.Client
    constructor(bot: Eris.Client) {
        super("template", {
            usage: "",
            description: "",
            category: "",
            aliases: [],
            type: 'all',
            devOnly: false,
        })

        this.bot = bot
    }

    public execute(): void {
        return
    }
}

export class CommandHandler extends EventEmitter {
    private _bot: Eris.Client
    private commands= new Map<string, BaseCommand>()
    constructor(bot: Eris.Client) {
        super()
        this._bot = bot
    }

    public add(command: BaseCommand): this {
        this.commands.set(command.name, command)
        
        return this
    }

    public remove(command: string | BaseCommand): this {
        this.commands.delete(typeof command === 'string' ? command : command.name)
        
        return this
    }

    public get(command: string | BaseCommand): BaseCommand {
        return this.commands.get(typeof command === 'string' ? command : command.name)
    }

    public getByAlias(name: string): BaseCommand | undefined {
        const command: BaseCommand[] = Array.from(this.filter((cmd) => cmd.name === name || cmd.extra.aliases?.includes(name)).values()[0])
        
        return command[0] || undefined
    }

    public filter(filter: (val: BaseCommand) => boolean): Map<string, BaseCommand> {
        const results = new Map<string, BaseCommand>()
        for (const [k,v] of this.commands.entries()) {
            if (filter(v)) {
                results.set(k,v)
            }
        }

        return results
    }

    public autoRegisterAll(): Promise<boolean> {
        fs.readdirSync(path.resolve(__dirname, '../commands'))
            .forEach(async dir => {
                const commandFiles = fs.readdirSync(path.resolve(__dirname, `../commands/${dir}/`)).filter(file => file.endsWith(process.env.NODE_ENV === 'development' ? ".ts" : ".js"))
                for (const file of commandFiles) {
                    let commandImport: typeof templateCommand = await import(path.resolve(__dirname, `../commands/${dir}/${file}`))
                    // @ts-expect-error .default not expected
                    commandImport = commandImport.default ? commandImport.default : commandImport
                    const command = new commandImport(this._bot)
                    if (command.name) {
                        this.add(command)
                    } else {
                        console.error(new Error(`${file} does not include a name property, cannot be executed`))
                    }
                }
            })

        return Promise.resolve(true)
    }
}
