
import {Kv} from "@e280/kv"

export type Database = {
	cartons: Kv<Carton>
	eggs: (eggId: string) => Kv<Egg>
}

/** a chat room */
export type Carton = {

	/** hash of the carton's symmetric key */
	id: string

	/** user id who owns this room */
	ownerId: string

	/** people-friendly text label */
	label: string

	/** when was the latest activity */
	latestActivityTime: number
}

/** an event in a chatroom, like a message or something */
export type Egg = {
	id: string
	time: number
	payload: string
}

