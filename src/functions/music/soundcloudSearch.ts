import { utilityFunctions } from './../../functions/functionExports'
import https from 'https'
import { URL } from 'url'

// search example:
// const testUrl = "https://api-v2.soundcloud.com/search?q=white%20rabbit&client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I&limit=1"

// track id example:
// const testUrl = "https://api-v2.soundcloud.com/tracks/272314661?client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I"

// track info from link example:
// const testUrl = "https://api-widget.soundcloud.com/resolve?url=https://soundcloud.com/kronik_electro/furi-my-only-chance-the-toxic-avenger&client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I"

/* get stream URL example:
get weird code from search from jsonThing.collection[0].media.transcodings[2].url.split('/')[5]
get weird code from track id from jsonThing.media.transcodings[2].url.split('/')[5]

Notes:
	index at position 5 might not always be the case */
// const testUrl = "https://api-v2.soundcloud.com/media/soundcloud:tracks:272314661/0e7792c9-34c5-4dde-9936-40ddcd95e5b5/stream/hls?client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I"

export default async function soundcloudSearch(requestedSong: string): Promise<string> {
	// ToDo: make compatible with mention inputs (e.g, @siege)
	let songID: string | undefined
	let mediaUrlKey: string
	if (utilityFunctions.isUrl(requestedSong)) {
		const trackUrl = `https://api-widget.soundcloud.com/resolve?url=${requestedSong}&client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I`
		const trackPromise: string[] = await new Promise((resolve, reject) => {
			const trackRequest = https.get(trackUrl, (res) => {
				res.on('data', d => {
					const result = JSON.parse(d)
					resolve([`${result.id}`, `${result.media.transcodings.at(-1).url.split('/')[5]}`])
				})
			})
	
			trackRequest.on('error', error => {
				console.error(`soundcloudSearch trackRequest error: ${error}`)
				reject(error)
			})
			trackRequest.end()
		})

		songID = trackPromise[0]
		mediaUrlKey = trackPromise[1]
	} else {
		const promiseResolve = await search(requestedSong, 0, 0)

		songID = promiseResolve[0]
		mediaUrlKey = promiseResolve[1]
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

async function search(requestedSong: string, offset: number, attempts: number): Promise<string[]> {
	return await new Promise((resolve, reject) => {
		const searchUrl = new URL(`https://api-v2.soundcloud.com/search?q=${requestedSong}&client_id=atkWGyMg57QFFAwK5c9VpC1N5Q141g7I&limit=${offset + 1}&offset=${offset}`)
		const searchRequest = https.get(searchUrl.href, (res) => {
			res.on('data', async d => {
				let result
				try {
					result = await JSON.parse(d)
					result = result.collection[0] // also need to get name, artist, etc for reply message
					if (!result) throw new Error("")
				} catch (_) {
					if (attempts > 10) return console.error('soundcloudSearch error: unable to parse data to JSON')
					search(requestedSong, offset, attempts + 1)
				}

				if (!(result.hasOwnProperty('media')) || result.monetization_model === "SUB_HIGH_TIER" /* 2nd part should only execute if 1st is false. */) {
					// can't play GO+ (sub_high_tier) songs becuase client is not GO+
					resolve(await search(requestedSong, offset + 1, attempts)) // some search requests are not songs, this hadnles that
					
					return
				}
				
				resolve([`${result.id}`, `${result.media.transcodings.at(-1).url.split('/')[5]}`])
				// at(-1) becuase, from what I've seen, the opus audio is last, but it isn't always there
			})
		})

		searchRequest.on('error', error => {
			console.error(`soundcloudSearch searchRequest error: ${error}`)
			reject(error)
		})
		searchRequest.end()
	})
}
