
import {Kv} from "@e280/kv"

export type Database = {
	voids: Kv<Void>
	drops: (dropId: string) => Kv<Drop>
}

/** an authlocal id that has been encrypted by the symkey (server doesn't have it) */
export type EncryptedId = string

/** arbitrary data that has been encrypted by the symkey (server doesn't have it) */
export type EncryptedData = string

export type Role = "admin" | "mod" | "muted"
export type RoleAssignment = [userId: EncryptedId, role: Role[]]

/** a chat room */
export type Void = {

	/** hash of the symmetric key */
	id: string

	/** encrypted pinned data payload (includes the void label) */
	pinned: EncryptedData

	/** role assigments for user ids */
	roles: RoleAssignment[]

	/** user ids who have read the void */
	peekers: EncryptedId[]

	/** when was the latest activity */
	latestActivityTime: number
}

/** an event in a chatroom, like a message or something */
export type Drop = {

	/** server-assigned unique id for this drop */
	id: string

	/** server-assigned timestamp when drop was posted */
	time: number

	/** encrypted data (includes the void label) */
	payload: EncryptedData
}

