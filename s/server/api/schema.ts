
import {AsFns, Secure} from "@e280/renraku/node"
import {Void, Drop, Ciphertext, UserId, VoidId, BubbleId, Vault, Noid, ClaimToken, TicketId, Ticket, TicketUpdate, Member} from "../types/types.js"

export type Serverside = AsFns<{
	stats: {
		voidCount(): Promise<number>
	}

	vault: Secure<ClaimToken, {
		save(vault: Noid<Vault>): Promise<void>
		load(): Promise<Vault | null>
		deliverInvite(recipientId: UserId, invite: Ciphertext): Promise<boolean>
	}>

	void: Secure<ClaimToken, {
		create(o: Void): Promise<void>
		join(voidId: VoidId, ticketId: TicketId): Promise<Member>
	}>

	knownVoid: Secure<ClaimToken, {
		read(): Promise<Void>
		update(partial: Partial<Noid<Void>>): Promise<Void>
		delete(): Promise<void>
		wipe(): Promise<void>
	}>

	tickets: Secure<ClaimToken, {
		list(): Promise<Ticket[]>
		create(ticket: Noid<Ticket>): Promise<Ticket>
		update(ticket: TicketUpdate): Promise<void>
		delete(...ids: TicketId[]): Promise<void>
	}>

	drops: Secure<ClaimToken, {
		list(bubbleId: BubbleId): Promise<Drop[]>
		post(bubbleId: BubbleId, payload: Ciphertext): Promise<Drop>
		delete(bubbleId: BubbleId, dropIds: string[]): Promise<void>
	}>

	sync: Secure<ClaimToken, {
		follow(voidIds: string[]): Promise<void>
	}>
}>

export type Clientside = {
	pulseVoid(voidId: VoidId, v: Void | null): Promise<void>
	pulseDrop(voidId: VoidId, bubbleId: BubbleId, drop: Drop): Promise<void>
}

