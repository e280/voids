
import {Kv} from "@e280/kv"

export type Database = {
	voids: Kv<Void>
	drops: (dropId: string) => Kv<Drop>
}

/** a chat room */
export type Void = {

	/** hash of the symmetric key */
	id: string

	/** user id who owns this room */
	ownerId: string

	/** people-friendly text label */
	label: string

	/** when was the latest activity */
	latestActivityTime: number
}

/** an event in a chatroom, like a message or something */
export type Drop = {
	id: string
	time: number
	payload: string
}

