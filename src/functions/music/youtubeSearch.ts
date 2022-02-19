import { utilityFunctions } from './../../functions/functionExports'
// eslint-disable-next-line camelcase
import fs from 'fs'
import { auth, youtube, youtube_v3 } from '@googleapis/youtube'

export default async function youtubeSearch(requestedSong: string, offset?: number): Promise<string> {
	const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
	const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL

	const authentication = new auth.GoogleAuth({
		credentials: {
			private_key: GOOGLE_PRIVATE_KEY,
			client_email: GOOGLE_CLIENT_EMAIL,
		},
		scopes: ["https://www.googleapis.com/auth/youtube.readonly"],
	})
	const authClient = await authentication.getClient()

	const client = youtube({
		version: "v3",
		auth: authClient,
	})

	let id

	if (utilityFunctions.isUrl(requestedSong)) {
		const url = new URL(requestedSong).searchParams
		if (!url.has('v')) { // ToDo: support playlists
			console.error('youtubeSearch get Id from URL failed - no "v" search parameter.')

			return '0'
		}
		id = url.get('v')

		return 'yea'
	} else {
		const res = await search(client, requestedSong, 0)
		if (res === '0') return '0'
		if (res === 'search failed') {
			console.error('youtubeSearch search failed - data.id undefined.')

			return '0'
		}

		id = res
	}
	console.log(id)

	// https://github.com/feribg/audiogetter/blob/5e874ecc9e373f3396195b768a54cf04bafaa0e8/audiogetter/src/main/java/com/github/feribg/audiogetter/tasks/download/VideoTask.java#L42
	// ^ how to download audio only from youtube link (supposedly)
	return 'yea'
}

async function search(client: youtube_v3.Youtube, requestedSong: string, offset?: number): Promise<string> {
	const res = await client.search.list({
		part: ['id', 'snippet'],
		maxResults: offset ? offset + 1 : 1,
		type: ['video', 'playlist'],
		q: "swimmer",
	})
	const data = res.data.items ? res.data.items[offset ? offset : 0] : 0 // metadata (Title and Author) in .snippet

	if (data === 0) {
		console.error(`youtubeSearch res.data.items undefined.`)

		return '0'
	}

	return data.id?.videoId ? data.id.videoId : 'search failed'
}
