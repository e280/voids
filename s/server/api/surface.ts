
import {AsFns, Secure} from "@e280/renraku/node"
import {Void, Drop, Ciphertext, UserId, VoidId, BubbleId, Vault, Noid, UserClaimToken, SeatClaimToken, TicketId, Ticket, TicketUpdate, SeatKey, DropId} from "../types/types.js"

export type Serverside = AsFns<{
	stats: {
		voidCount(): Promise<number>
	}

	/** the vault is decryptable only by the user themselves, via authlocal. it's their account information, hidden from the server */
	vault: Secure<UserClaimToken, {
		save(vault: Noid<Vault>): Promise<void>
		load(): Promise<Vault | null>
		deliverInvite(recipientId: UserId, invite: Ciphertext): Promise<boolean>
	}>

	/** a void is a community hub, which can contain chatrooms */
	void: Secure<UserClaimToken, {
		create(o: Void): Promise<void>
		join(voidId: VoidId, ticketId: TicketId): Promise<SeatKey>
	}>

	/** fns for void members */
	knownVoid: Secure<SeatClaimToken, {
		read(): Promise<Void>
		update(partial: Partial<Noid<Void>>): Promise<Void>
		delete(): Promise<void>
		wipeAllDrops(): Promise<void>
		wipeMyDrops(): Promise<void>
		destroyMySeat(): Promise<void>
	}>

	/** a ticket is redeemable for void membership */
	tickets: Secure<SeatClaimToken, {
		list(): Promise<Ticket[]>
		create(ticket: Noid<Ticket>): Promise<Ticket>
		update(ticket: TicketUpdate): Promise<void>
		delete(...ids: TicketId[]): Promise<void>
	}>

	/** a drop is a post, like a message, in a bubble chatroom */
	drops: Secure<SeatClaimToken, {
		list(bubbleId: BubbleId): Promise<Drop[]>
		post(bubbleId: BubbleId, payload: Ciphertext): Promise<Drop>
		delete(bubbleId: BubbleId, dropIds: string[]): Promise<void>
	}>

	/** clients can declare what voids they want to subscribe for changes to */
	sync: Secure<UserClaimToken, {
		follow(voidIds: string[]): Promise<void>
	}>
}>

export type Clientside = {

	/** the server can push a realtime update about a void */
	pulseVoid(voidId: VoidId, v: Void | null): Promise<void>

	/** the server can push a realtime update about a drop */
	pulseDrop(voidId: VoidId, bubbleId: BubbleId, dropId: DropId, drop: Drop | null): Promise<void>
}

