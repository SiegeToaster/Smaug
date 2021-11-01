import { URL } from "url"

export default function isUrl(string: string | null | undefined): boolean {
	if (!string) return false
	
	let url: URL
	
	try {
		url = new URL(string)
	} catch {
		return false
	}
  
	return url.protocol === "http:" || url.protocol === "https:"
}
