
import {Hex} from "@e280/stz"

export async function hashHex(hex: string) {
	const bytes = Hex.toBytes(hex)
	const hashed = await crypto.subtle.digest("SHA-256", bytes)
	return Hex.fromBytes(new Uint8Array(hashed))
}

