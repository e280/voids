
import {Hex} from "@e280/stz"
import {collect} from "@e280/kv"
import {ExposedError} from "@e280/renraku/node"

import {Space} from "../parts/space.js"
import {constants} from "../../constants.js"
import {secureUser} from "./utils/secure-user.js"
import {Clientside, Serverside} from "./surface.js"
import {secureMember} from "./utils/secure-member.js"
import {resolvePrivileges} from "../parts/resolve-privileges.js"
import {DropRecord, Noid, TicketRecord, Vault, VoidRecord} from "../types/types.js"

export const setupServerside = (
		space: Space,
		_clientside: Clientside,
	): Serverside => ({

	stats: {
		async voidCount() {
			return space.voidCount
		},
	},

	vault: secureUser(({user}) => ({
		async save(vault: Noid<Vault>) {
			await space.database.vaults.set(user.id, vault)
		},
		async load() {
			const vault = await space.database.vaults.get(user.id)
			return vault
				? {...vault, id: user.id}
				: null
		},
		async deliverInvite(recipientId, invite) {
			const vault = await space.database.vaults.get(recipientId)
			if (!vault) return false
			vault.invites = [...vault.invites, invite].slice(-constants.maxInvites)
			await space.database.vaults.set(recipientId, vault)
			return true
		},
	})),

	void: secureUser(({user}) => ({
		async create(v) {
			if (await space.database.voids.has(v.id))
				throw new ExposedError("this void already exists")
			return await space.database.voids.set(v.id, {
				bulletin: v.bulletin,
				members: v.members,
				roles: v.roles,
				bubbles: v.bubbles,
				latestActivityTime: Date.now(),
			})
		},
		async join(voidId, ticketId) {
			const v = await space.database.voids.require(voidId)
			const ticket = await space.database.tickets(voidId).require(ticketId)

			ticket.uses++
			ticket.timeLastUsed = Date.now()
			if (ticket.remaining !== null)
				ticket.remaining--

			const member = Hex.random()
			v.members.push(member)

			if (v.members.length > constants.maxVoidMembers)
				throw new ExposedError("exceeded max void members")

			const ticketIsExpired = (
				ticket.remaining !== null &&
				ticket.remaining <= 0
			)

			const newTicket = ticketIsExpired
				? undefined
				: ticket

			await space.database.voids.set(voidId, v)
			await space.database.tickets(voidId).set(ticketId, newTicket)
			return member
		},
	})),

	tickets: secureMember(space, ({user, member, void: v}) => ({
		async list() {
			const records = await collect(space.database.tickets(v.id).entries())
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
			await space.database.tickets(v.id).set(id, record)
			return {...record, id}
		},
		async update(ticket) {
			const already = await space.database.tickets(v.id).require(ticket.id)
			await space.database.tickets(v.id).set(ticket.id, {
				...already,
				remaining: ticket.remaining,
			})
		},
		async delete(...ids) {
			await space.database.tickets(v.id).del(...ids)
		},
	})),

	knownVoid: secureMember(space, ({user, member, void: v}) => ({
		async read() {
			return v
		},
		async update(partial) {
			const privileges = resolvePrivileges(v, member)
			if (!privileges.canUpdateVoid) throw new ExposedError("not allowed")

			const v2 = {...v, ...partial}
			const updated: VoidRecord = {
				roles: v2.roles,
				bubbles: v2.bubbles,
				members: v2.members,
				bulletin: v2.bulletin,
				latestActivityTime: Date.now(),
			}
			await space.database.voids.set(v.id, updated)
			return {...updated, id: v.id}
		},

		async delete() {
			const privileges = resolvePrivileges(v, member)
			if (!privileges.canDeleteVoid) throw new ExposedError("not allowed")

			// delete all drops in void
			await space.database.voidDrops(v.id).del(
				...await collect(space.database.voidDrops(v.id).keys())
			)

			await space.database.voids.del(v.id)
		},

		async wipe() {
			const privileges = resolvePrivileges(v, member)
			if (!privileges.canWipeVoid) throw new ExposedError("not allowed")

			// delete all drops in void
			await space.database.voidDrops(v.id).del(
				...await collect(space.database.voidDrops(v.id).keys())
			)
		},
	})),

	drops: secureMember(space, ({member, void: v}) => ({
		async list(bubbleId) {
			const privileges = resolvePrivileges(v, member, bubbleId)
			if (!privileges.canReadDrops) throw new ExposedError("not allowed")
			const drops = await collect(space.database.drops(v.id, bubbleId).entries())
			return drops.map(([id, drop]) => ({...drop, id}))
		},
		async post(bubbleId, payload) {
			const privileges = resolvePrivileges(v, member, bubbleId)
			if (!privileges.canPostDrops)
				throw new ExposedError("not allowed")
			const id = Hex.random()
			const drop: DropRecord = {payload, time: Date.now()}
			await space.database.drops(v.id, bubbleId).set(id, drop)
			return {...drop, id}
		},
		async delete(bubbleId, dropIds) {
			const privileges = resolvePrivileges(v, member, bubbleId)
			if (!privileges.canDeleteDrops)
				throw new ExposedError("not allowed")
			await space.database.drops(v.id, bubbleId).del(...dropIds)
		},
	})),

	sync: secureUser(({user}) => ({
		async follow(voidIds) {
			// TODO listen to these voids, unlisten to all others
		},
	})),
})

