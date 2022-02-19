declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_TOKEN: string
			SQL_PASSWORD: string
			SQL_USERNAME: string
			SOUNDCLOUD_CLIENT_ID: string
			GOOGLE_PRIVATE_KEY: string
			GOOGLE_CLIENT_EMAIL: string
		}
	}
}

export {}
