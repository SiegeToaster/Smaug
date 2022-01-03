import { AudioPlayer } from '@discordjs/voice'
import { utilityFunctions } from './../../functions/functionExports'
import https from 'https'
import { URL } from 'url'
import { request } from 'http'

// search example:
// const testUrl = "https://api-v2.soundcloud.com/search?q=white%20rabbit&client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I&limit=1"

// track id example:
// const testUrl = "https://api-v2.soundcloud.com/tracks/272314661?client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I"

/* get stream URL example:
get weird code from search from jsonThing.collection[0].media.transcodings[2].url.split('/')[5]
get weird code from track id from jsonThing.media.transcodings[2].url.split('/')[5]

Notes:
	might not always be 3 transcodings, find a way to search for the Opus codec
	index at position 5 might be incorrect */
// const testUrl = "https://api-v2.soundcloud.com/media/soundcloud:tracks:272314661/0e7792c9-34c5-4dde-9936-40ddcd95e5b5/stream/hls?client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I"

export default async function soundcloudSearch(requestedSong: string): Promise<string> {
	let songID: string | undefined
	let mediaUrlKey: string
	if (!utilityFunctions.isUrl(requestedSong)) {
		const promiseResolve: string[] = await new Promise((resolve, reject) => {
			const searchUrl = new URL(`https://api-v2.soundcloud.com/search?q=${requestedSong}&client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I&limit=1`)
			const searchRequest = https.get(searchUrl.href, (res) => {
				res.on('data', d => {
					let result = JSON.parse(d)
					result = result.collection[0] // also need to get name, artist, etc for reply message
					resolve([`${result.id}`, `${result.media.transcodings[2].url.split('/')[5]}`])
					// ToDo: make offset parameter and go to next song if the current one is not a valid song
					// ToDo: try catch to fix the incomplete JSON problem, needs a more permanent fix for future
				})
			})
	
			searchRequest.on('error', error => {
				console.error(`soundcloudSearch searchRequest error: ${error}`)
				reject(error)
			})
			searchRequest.end()
		})

		songID = promiseResolve[0]
		mediaUrlKey = promiseResolve[1]
	} else {
		songID = requestedSong.split('/').at(-1)
		mediaUrlKey = '' // ToDo: use track id example to get Url key from ID
	}

	
	return await new Promise((resolve, reject) => {
		const streamUrl = new URL(`https://api-v2.soundcloud.com/media/soundcloud:tracks:${songID}/${mediaUrlKey}/stream/hls?client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I`)
		const streamRequest = https.get(streamUrl.href, (res) => {
			res.on('data', d => {
				let result = JSON.parse(d)
				result = result.url
				resolve(result)
			})
		})

		streamRequest.on('error', error => {
			console.error(`soundcloudSearch streamRequest error: ${error}`)
			reject(error)
		})
		streamRequest.end()
	})
}
