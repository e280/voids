
import {Cryption, Symkey} from "../types.js"
import {generateSymkey} from "../parts/symkey.js"

export class FakeCryption implements Cryption {
	static async generate() {
		return new this(await generateSymkey())
	}

	constructor(public symkey: Symkey) {}

	async encrypt(payload: string) {
		const {secret} = this.symkey
		return secret + payload
	}

	async decrypt(ciphertext: string) {
		const {secret} = this.symkey
		const leading = ciphertext.slice(0, secret.length)
		const payload = ciphertext.slice(secret.length)
		if (leading !== secret)
			throw new Error("fake decryption failed, wrong symkey")
		return payload
	}
}

