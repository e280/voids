
import {Hex} from "@e280/stz";
import {Symkey} from "../types.js"
import {hashHex} from "../../server/tools/hash-hex.js"

export async function generateSymkey(): Promise<Symkey> {
	const secret = Hex.random()
	const id = await hashHex(secret)
	return {id, secret}
}

