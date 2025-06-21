
export type Symkey = {
	id: string
	secret: string
}

export abstract class Cryption {
	abstract symkey: Symkey
	abstract encrypt(payload: string): Promise<string>
	abstract decrypt(ciphertext: string): Promise<string>
}

