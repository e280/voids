
import {AsFns, Secure} from "@e280/renraku/node"
import {Void, Drop, RoleAssignment} from "../parts/types.js"

export type Auth = {
	claimToken: string
}

export type AuthClaim = {}

export type Serverside = AsFns<{
	anon: {

		/** see how many voids are active */
		getVoidCount(): Promise<number>
	}

	user: Secure<Auth, {

		/** create a new void */
		createVoid(voidId: string, o: {pinned: string}): Promise<Void>

		/** query a void */
		readVoid(voidId: string): Promise<Void | undefined>

		/** update a void */
		updateVoid(voidId: string, o: {pinned?: string, roles?: RoleAssignment[]}): Promise<Void>

		/** terminate a void */
		deleteVoid(voidId: string): Promise<void>

		/** post a drop (messages etc) */
		postDrop(voidId: string, payload: string): Promise<Drop>

		/** list all drops in a void */
		listDrops(voidId: string): Promise<Drop[]>

		/** delete a list of drops */
		deleteDrops(voidId: string, dropIds: string[]): Promise<void>

		/** delete all the drops in a void */
		wipeVoidDrops(voidId: string): Promise<void>

		/** declare what voids you subscribe to update for */
		follow(voidIds: string[]): Promise<void>
	}>
}>

export type Clientside = {
	pulseVoid(voidId: string, v: Void | null): Promise<void>
	pulseDrop(voidId: string, drop: Drop): Promise<void>
}

