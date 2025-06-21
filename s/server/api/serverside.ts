
import {Hex} from "@e280/stz"
import {collect} from "@e280/kv"
import {ExposedError} from "@e280/renraku/node"

import {noid} from "../tools/noid.js"
import {Space} from "../parts/space.js"
import {hashHex} from "../tools/hash-hex.js"
import {constants} from "../../constants.js"
import {Follower} from "../parts/follower.js"
import {Hierarchy} from "../parts/hierarchy.js"
import {secureUser} from "./utils/secure-user.js"
import {Clientside, Serverside} from "./surface.js"
import {secureSeat} from "./utils/secure-member.js"
import {DropRecord, Noid, TicketRecord, Vault, VoidRecord} from "../types/types.js"

export const setupServerside = (
		space: Space,
		follower: Follower,
		_clientside: Clientside,
	): Serverside => {

	const {database} = space

	return {
		async stats() {
			return space.stats
		},

		vault: secureUser(({user}) => ({
			async save(vault: Noid<Vault>) {
				await database.vaults.set(user.id, vault)
			},
			async load() {
				const vault = await database.vaults.get(user.id)
				return vault
					? {...vault, id: user.id}
					: null
			},
			async deliverInvite(recipientId, invite) {
				const vault = await database.vaults.get(recipientId)
				if (!vault) return false
				vault.invites = [...vault.invites, invite].slice(-constants.maxInvites)
				await database.vaults.set(recipientId, vault)
				return true
			},
		})),

		void: secureUser(({user}) => ({
			async create(v) {
				if (await database.voids.has(v.id))
					throw new ExposedError("this void already exists")
				return await database.voids.set(v.id, {
					bulletin: v.bulletin,
					seats: v.seats,
					hierarchy: v.hierarchy,
					latestActivityTime: Date.now(),
				})
			},
			async join(voidId, ticketId) {
				const v = await database.voids.require(voidId)
				const ticket = await database.void(voidId).tickets.require(ticketId)

				if (v.seats.length > constants.maxVoidMembers)
					throw new ExposedError("exceeded max void members")

				ticket.uses++
				ticket.timeLastUsed = Date.now()
				if (ticket.remaining !== null)
					ticket.remaining--

				const seatKey = Hex.random()
				const seatId = await hashHex(seatKey)
				v.seats.push({id: seatId, joinedTime: Date.now()})

				const ticketIsExpired = (
					(ticket.expiresAt !== null && ticket.expiresAt < Date.now()) ||
					(ticket.remaining !== null && ticket.remaining <= 0)
				)

				const newTicket = ticketIsExpired
					? undefined
					: ticket

				await database.kv.transaction(() => [
					database.void(voidId).self.write.set(v),
					database.void(voidId).tickets.write.set(ticketId, newTicket),
				])

				return seatKey
			},
		})),

		tickets: secureSeat(space, ({void: v}) => ({
			async list() {
				const records = await collect(database.void(v.id).tickets.entries())
				return records.map(([id, t]) => ({...t, id}))
			},
			async create(ticket) {
				const id = Hex.random()
				const now = Date.now()
				const record: TicketRecord = {
					...ticket,
					timeCreated: now,
					timeLastUsed: now,
					remaining: ticket.remaining,
				}
				await database.void(v.id).tickets.set(id, record)
				return {...record, id}
			},
			async update(ticket) {
				const already = await database.void(v.id).tickets.require(ticket.id)
				await database.void(v.id).tickets.set(ticket.id, {
					...already,
					remaining: ticket.remaining,
				})
			},
			async delete(...ids) {
				await database.void(v.id).tickets.del(...ids)
			},
		})),

		knownVoid: secureSeat(space, ({user, seatKey, seatId, void: v}) => ({
			async read() {
				return v
			},
			async update(partial) {
				const hierarchy = new Hierarchy(v.hierarchy)
				const privileges = hierarchy.resolvePrivileges(hierarchy.root, seatId)
				if (!privileges.canUpdateVoid) throw new ExposedError("not allowed")

				const v2 = {...v, ...partial}
				const updated: VoidRecord = {
					seats: v2.seats,
					bulletin: v2.bulletin,
					hierarchy: v2.hierarchy,
					latestActivityTime: Date.now(),
				}
				await database.voids.set(v.id, updated)
				return {...updated, id: v.id}
			},

			async delete() {
				const hierarchy = new Hierarchy(v.hierarchy)
				const privileges = hierarchy.resolvePrivileges(hierarchy.root, seatId)
				if (!privileges.canDeleteVoid) throw new ExposedError("not allowed")
				await space.deleteVoid(v.id)
			},

			async wipeAllDrops() {
				const hierarchy = new Hierarchy(v.hierarchy)
				const privileges = hierarchy.resolvePrivileges(hierarchy.root, seatId)
				if (!privileges.canWipeVoid) throw new ExposedError("not allowed")
				await database.void(v.id).drops.clear()
			},

			async wipeMyDrops() {
				await space.wipeDropsBySeat(v.id, seatId)
			},

			async destroyMySeat() {
				// filter out the seat
				v.seats = v.seats.filter(seat => seat.id !== seatId)

				const hierarchy = new Hierarchy(v.hierarchy)

				// eliminate seat id from all hierarchy role assignments
				for (const node of hierarchy.nodes.values()) {
					if ("assignments" in node) {
						for (const entry of node.assignments)
							entry[1] = entry[1].filter(id => id !== seatId)
					}
				}

				v.hierarchy = hierarchy.toData()

				// update the void
				await database.voids.set(v.id, {
					...noid(v),
					latestActivityTime: Date.now(),
				})
			},
		})),

		drops: secureSeat(space, ({seatId, void: v}) => ({
			async list(bubbleId) {
				const hierarchy = new Hierarchy(v.hierarchy)
				const bubbleNode = hierarchy.findNodeForBubble(bubbleId)
				const privileges = hierarchy.resolvePrivileges(bubbleNode.id, seatId)

				if (!privileges.canReadDrops) throw new ExposedError("not allowed")
				const drops = await collect(database.void(v.id).bubble(bubbleId).drops.entries())
				return drops.map(([id, drop]) => ({...drop, id}))
			},
			async post(bubbleId, payload) {
				const hierarchy = new Hierarchy(v.hierarchy)
				const bubbleNode = hierarchy.findNodeForBubble(bubbleId)
				const privileges = hierarchy.resolvePrivileges(bubbleNode.id, seatId)

				if (!privileges.canPostDrops)
					throw new ExposedError("not allowed")
				const id = Hex.random()
				const drop: DropRecord = {payload, lifespan: null, seatId, time: Date.now()}
				await database.void(v.id).bubble(bubbleId).drops.set(id, drop)
				return {...drop, id}
			},
			async delete(bubbleId, dropIds) {
				const hierarchy = new Hierarchy(v.hierarchy)
				const bubbleNode = hierarchy.findNodeForBubble(bubbleId)
				const privileges = hierarchy.resolvePrivileges(bubbleNode.id, seatId)

				if (!privileges.canDeleteDrops)
					throw new ExposedError("not allowed")
				await database.void(v.id).bubble(bubbleId).drops.del(...dropIds)
			},
		})),

		sync: secureUser(() => ({
			async follow(voidIds) {
				follower.follow(voidIds)
			},
		})),
	}
}

