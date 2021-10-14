export default function secondsToMinutes(seconds: number): number[] {
	const minutes = seconds % 60
	seconds -= minutes * 60

	return [minutes, seconds]
}
