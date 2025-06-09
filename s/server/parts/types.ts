
import {Kv} from "@e280/kv"

export type Database = {
	voids: Kv<Void>
	drops: (dropId: string) => Kv<Drop>
}

/** a chat room */
export type Void = {

	/** all user ids who have ever viewed this void */
	seen: string[]

	/** when was the latest activity */
	latestActivityTime: number

} & VoidOptions

export type VoidOptions = {

	/** hash of the symmetric key */
	id: string

	/** user id who owns this room */
	ownerId: string

	/** people-friendly text label */
	label: string

	/** user ids allowed to see this void, or null for public void */
	private: null | string[]
}

/** an event in a chatroom, like a message or something */
export type Drop = {
	id: string
	time: number
	payload: unknown
}

