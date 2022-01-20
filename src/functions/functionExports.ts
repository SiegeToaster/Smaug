import countGuildMembers from "./util/countGuildMembers"
import initSQL from "./util/initSQL"
import isAudioUrl from "./util/isAudioUrl"
import isUrl from "./util/isUrl"
import secondsToMinutes from "./util/secondsToMinutes"
import timer from "./util/timer"

export const utilityFunctions = {
	countGuildMembers,
	initSQL,
	isAudioUrl,
	isUrl,
	secondsToMinutes,
	timer,
}


import connectToChannel from "./music/connectToChannel"
import createDiscordJSAdapter from "./music/createDiscordJSAdapter"
import playSong from "./music/playSong"
import soundcloudSearch from "./music/soundcloudSearch"
export const musicFunctions = {
	connectToChannel,
	createDiscordJSAdapter,
	playSong,
	soundcloudSearch,
}
