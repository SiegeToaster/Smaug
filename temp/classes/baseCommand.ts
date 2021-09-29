export interface CommandExtra {
    usage?: string
    description?: string
    category?: string
    aliases?: string[]
    type?: 'dm' | 'guild' | 'all'
    devOnly?: boolean
}

export abstract class BaseCommand {
    private _name: string
    private _extra: CommandExtra
    constructor(name: string, extra?: CommandExtra) {
        this._name = name
        this._extra = extra
    }

    get name(): string {
        return this._name
    }

    get extra(): CommandExtra {
        return this.extra
    }

    public abstract execute(): void
}
