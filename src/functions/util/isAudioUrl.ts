import { URL } from "url"

export default function isAudioUrl(string: string | null | undefined): boolean {
	if (!string) return false
	
	let url: URL
	
	try {
		url = new URL(string)
	} catch {
		return false
	}
	
	const acceptableFormats = [
		".aa",
		".aac",
		".aax",
		".act",
		".aiff",
		".alac",
		".amr",
		".ape",
		".au",
		".awb",
		".dss",
		".dfv",
		".flac",
		".gsm",
		".iklax",
		".ivs",
		".m4a",
		".m4b",
		".m4p",
		".m4v",
		".mmf",
		".mp3",
		".mpc",
		".mpg",
		".mpeg",
		".m2v",
		".mov",
		".qt",
		".mp4",
		".m4p",
		".m4v",
		".msv",
		".nmf",
		".oga",
		".mogg",
		".opus",
		".ra",
		".raw",
		".3gp",
		".3g2",
		".mkv",
		".avi",
		".asf",
		".MTS",
		".M2TS",
		".TS",
		".viv",
		".flv",
		".mpg",
		".mp2",
		".mpeg",
		".mp3",
		".mpv",
		".vob",
		".rm",
		".rmvb",
		".rf64",
		".sln",
		".tta",
		".voc",
		".wav",
		".wma",
		".wv",
		".flv",
		".f4v",
		".f4p",
		".f4a",
		".f4b",
		".amv",
		".ogv",
		".ogg",
		".webm",
		".wmv",
		".8svx",
		".cda",
	] 	/* 	this should be all audio formats and video formats that support audio
			taken from https://en.wikipedia.org/wiki/Audio_file_format
			and https://en.wikipedia.org/wiki/Video_file_format
		*/
	let result = false

	for (const format of acceptableFormats) { // ToDo: search for a better way to do this
		if (url.hostname.endsWith(format)) { // url.hostname untested, should work though (used to be string)
			result = true
			break
		}
	}

	return result
}
