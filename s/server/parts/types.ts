
import {Kv} from "@e280/kv"
import {Privileges} from "./privileges.js"

export type Database = {
	voids: Kv<Void>
	drops: (voidId: VoidId, bubbleId: BubbleId) => Kv<Drop>
}

export type Id = string
export type UserId = Id
export type VoidId = Id
export type BubbleId = Id
export type RoleId = Id
export type DropId = Id

/** arbitrary encrypted data */
export type Ciphertext = string

/** a membership key, 64 random hex characters */
export type Member = string

export type RoleEntry = [roleId: RoleId, role: Role]
export type Role = {
	label: Ciphertext
	privileges: Privileges
	members: Member[]
}

/** a community */
export type Void = {
	bulletin: Ciphertext
	roles: RoleEntry[]
	bubbles: Bubble[]
	latestActivityTime: number
}

/** a chat room */
export type Bubble = {
	header: Ciphertext
	roles: RoleEntry[]
	children: BubbleId[]
}

/** an event in a chatroom, like a message or something */
export type Drop = {
	time: number
	payload: Ciphertext
}

