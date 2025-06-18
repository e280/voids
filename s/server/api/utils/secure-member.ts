
import {ExposedError, Service, secure} from "@e280/renraku"
import {authUser} from "./auth-user.js"
import {Space} from "../../parts/space.js"
import {hashHex} from "../../tools/hash-hex.js"
import {SeatAuth, SeatClaim, SeatClaimToken} from "../../types/types.js"

const noMessage = "no such void, or you're not a member"

export function secureSeat<S extends Service>(
		space: Space,
		fn: (auth: SeatAuth) => S,
	) {

	return secure<SeatClaimToken, S>(async claimToken => {
		const {user, claim} = await authUser<SeatClaim>(claimToken)

		const v = await space.database.voids.get(claim.voidId)
		if (!v) throw new ExposedError(noMessage)

		const validMembership = v.seats.includes(claim.seatKey)
		if (!validMembership) throw new ExposedError(noMessage)

		return fn({
			user,
			seatKey: claim.seatKey,
			seatId: await hashHex(claim.seatKey),
			void: {...v, id: claim.voidId},
		})
	})
}

