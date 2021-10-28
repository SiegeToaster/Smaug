import secondsToMinutes from "./util/secondsToMinutes"
import timer from "./util/timer"
import countGuildMembers from "./util/countGuildMembers"

export const utilityFunctions = {
	secondsToMinutes,
	timer,
	countGuildMembers,
}


import createDiscordJSAdapter from "./music/createDiscordJSAdapter"
import playSong from "./music/playSong"
import connectToChannel from "./music/connectToChannel"
export const musicFunctions = {
	createDiscordJSAdapter,
	playSong,
	connectToChannel,
}
