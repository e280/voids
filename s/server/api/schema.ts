
import {AsFns, Secure} from "@e280/renraku/node"
import {Void, Drop, Ciphertext, UserId, VoidId, RoleEntry, BubbleId} from "../parts/types.js"

export type Auth = {claimToken: string}

export type Serverside = AsFns<{
	stats: {
		voidCount(): Promise<number>
	}

	keycard: Secure<Auth, {
		save(ciphertext: Ciphertext): Promise<void>
		load(): Promise<Ciphertext>
	}>

	vault: Secure<Auth, {
		save(ciphertext: Ciphertext): Promise<void>
		load(): Promise<Ciphertext>
		deliverInvite(recipientId: UserId, invite: Ciphertext): Promise<void>
	}>,

	void: Secure<Auth, {
		create(id: VoidId, o: {bulletin: Ciphertext}): Promise<Void>
		read(id: VoidId): Promise<Void | undefined>
		update(id: VoidId, o: {bulletin?: Ciphertext, roles?: RoleEntry[]}): Promise<Void>
		delete(id: VoidId): Promise<void>
		wipe(id: VoidId): Promise<void>
	}>,

	drops: Secure<Auth, {
		list(voidId: VoidId, bubbleId: BubbleId): Promise<Drop[]>
		post(voidId: VoidId, bubbleId: BubbleId, payload: Ciphertext): Promise<Drop>
		delete(voidId: VoidId, bubbleId: BubbleId, dropIds: string[]): Promise<void>
	}>,

	sync: Secure<Auth, {
		follow(voidIds: string[]): Promise<void>
	}>,
}>

export type Clientside = {
	pulseVoid(voidId: VoidId, v: Void | null): Promise<void>
	pulseDrop(voidId: VoidId, bubbleId: BubbleId, drop: Drop): Promise<void>
}

