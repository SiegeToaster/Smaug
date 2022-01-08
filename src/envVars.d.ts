declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_TOKEN: string
			SQL_PASSWORD: string
			SQL_USERNAME: string
		}
	}
}

export {}
