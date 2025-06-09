
import {AsFns, Secure} from "@e280/renraku/node"
import {Void, Drop, VoidOptions} from "../parts/types.js"

export type Auth = {
	claimToken: string
}

export type AuthClaim = {}

export type Serverside = AsFns<{
	user: Secure<Auth, {
		setVoid(options: VoidOptions): Promise<Void>
		getVoid(voidId: string): Promise<Void | undefined>

		drop(voidId: string, payload: string): Promise<Drop>
		getDrops(voidId: string): Promise<Drop[]>

		followVoid(voidId: string): Promise<void>
		unfollowVoid(voidId: string): Promise<void>
	}>
}>

export type Clientside = {
	void(v: Void): Promise<void>
	drop(voidId: string, drop: Drop): Promise<void>
}

