
import {AsFns, Secure} from "@e280/renraku"
import {Void, Drop} from "../parts/types.js"

export type Auth = {
	claimToken: string
}

export type AuthClaim = {}

export type Serverside = AsFns<{
	anon: {
		getVoid(voidId: string): Promise<Void | undefined>
		followVoid(voidId: string): Promise<void>
		unfollowVoid(voidId: string): Promise<void>
		getDrops(voidId: string): Promise<Drop[]>
	}
	user: Secure<Auth, {
		makeVoid(id: string, label: string): Promise<Void>
		drop(voidId: string, payload: string): Promise<Drop>
	}>
}>

export type Clientside = {
	drop(voidId: string, drop: Drop): Promise<void>
}

