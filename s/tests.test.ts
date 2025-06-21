
import {Time} from "@e280/authlocal/core"
import {Science, test, expect} from "@e280/science"

import {vibes} from "./testing/setup-vibe.js"
import {hashHex} from "./server/tools/hash-hex.js"
import {makeVoid} from "./client/parts/make-void.js"
import {FakeCryption} from "./client/testing/fake-cryption.js"

await Science.run({
	"server": Science.suite({
		"stats": test(vibes(async vibe => {
			const {serverside} = await vibe.connect()
			const stats = await serverside.stats()
			expect(stats.voidCount).is(0)
		})),

		"create a void": test(vibes(async vibe => {
			const {serverside} = await vibe.connect()

			const auth = await vibe.authenticate()
			const userClaim = await auth.signUserClaim()

			const cryption = await FakeCryption.generate()
			const {void: v} = await makeVoid(cryption)

			await serverside.void.create(userClaim, v)
			const stats = await serverside.stats()
			expect(stats.voidCount).is(1)
		})),

		"join a void": test(vibes(async vibe => {
			const {serverside} = await vibe.connect()

			const {voidId, ticketId} = await (async() => {
				const auth = await vibe.authenticate()
				const userClaim = await auth.signUserClaim()

				const cryption = await FakeCryption.generate()
				const {void: v, adminSeatKey} = await makeVoid(cryption)

				await serverside.void.create(userClaim, v)
				const seatClaim = await auth.signSeatClaim(v.id, adminSeatKey)
				const ticket = await serverside.tickets.create(seatClaim, {
					captcha: false,
					expiresAt: Time.future.days(1),
					remaining: null,
					timeCreated: Date.now(),
					timeLastUsed: Date.now(),
					uses: 0,
				})
				const ticketId = ticket.id

				expect(v.seats.length).is(1)
				return {voidId: v.id, cryption, ticketId}
			})()

			await (async() => {
				const auth = await vibe.authenticate()
				const userClaim = await auth.signUserClaim()
				const {seatKey} = await serverside.void.join(userClaim, voidId, ticketId)
				const seatId = await hashHex(seatKey)
				const seatClaim = await auth.signSeatClaim(voidId, seatKey)
				const v = await serverside.knownVoid.read(seatClaim)
				expect(v).ok()
				expect(v.id).is(voidId)
				expect(v.seats.length).is(2)
				expect(v.seats.some(seat => seat.id === seatId)).ok()
			})()
		})),
	}),
})

