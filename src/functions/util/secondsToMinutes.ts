export default function secondsToMinutes(seconds: number, isString?: boolean): number[] | string {
	if (isString == null || isString == undefined) isString = false
	const minutes = Math.floor(seconds / 60)
	seconds -= minutes * 60

	if (isString) {
		return `${minutes} minutes, ${seconds} seconds`
	} else {
		return [minutes, seconds]
	}
}
