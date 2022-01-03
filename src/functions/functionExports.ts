import countGuildMembers from "./util/countGuildMembers"
import isUrl from "./util/isUrl"
import secondsToMinutes from "./util/secondsToMinutes"
import timer from "./util/timer"

export const utilityFunctions = {
	countGuildMembers,
	isUrl,
	secondsToMinutes,
	timer,
}


import createDiscordJSAdapter from "./music/createDiscordJSAdapter"
import playSong from "./music/playSong"
import connectToChannel from "./music/connectToChannel"
import soundcloudSearch from "./music/soundcloudSearch"
export const musicFunctions = {
	createDiscordJSAdapter,
	playSong,
	connectToChannel,
	soundcloudSearch,
}
