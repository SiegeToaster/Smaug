import Eris from 'eris'

export type ErisPermissions = (
    "createInstantInvite" |
    "kickMembers" |
    "banMembers" |
    "administrator" |
    "manageChannels" |
    "manageGuild" |
    "addReactions" |
    "viewAuditLog" |
    "viewAuditLogs" |
    "voicePrioritySpeaker" |
    "voiceStream" |
    "stream" |
    "viewChannel" |
    "readMessages" |
    "sendMessages" |
    "sendTTSMessages" |
    "manageMessages" |
    "embedLinks" |
    "attachFiles" |
    "readMessageHistory" |
    "mentionEveryone" |
    "useExternalEmojis" |
    "externalEmojis" |
    "viewGuildInsights" |
    "voiceConnect" |
    "voiceSpeak" |
    "voiceMuteMembers" |
    "voiceDeafenMembers" |
    "voiceMoveMembers" |
    "voiceUseVAD" |
    "changeNickname" |
    "manageNicknames" |
    "manageRoles" |
    "manageWebhooks" |
    "manageEmojis" |
    "useSlashCommands" |
    "voiceRequestToSpeak" |
    "allGuild" |
    "allText" |
    "allVoice" |
    "all"
)

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
