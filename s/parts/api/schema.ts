
import {AsFns, Secure} from "@e280/renraku"
import {Carton, Egg} from "../types.js"

export type Auth = {
	claimToken: string
}

export type AuthClaim = {}

export type Serverside = AsFns<{
	anon: {
		getCarton(cartonId: string): Promise<Carton | undefined>
		followCarton(cartonId: string): Promise<void>
		unfollowCarton(cartonId: string): Promise<void>
		getEggs(cartonId: string): Promise<Egg[]>
	}
	user: Secure<Auth, {
		createCarton(id: string, label: string): Promise<Carton>
		addEgg(cartonId: string, payload: string): Promise<Egg>
	}>
}>

export type Clientside = {
	freshEgg(cartonId: string, egg: Egg): Promise<void>
}

