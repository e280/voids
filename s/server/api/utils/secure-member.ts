
import {ExposedError, Service, secure} from "@e280/renraku"
import {authUser} from "./auth-user.js"
import {Space} from "../../parts/space.js"
import {ClaimToken, MemberAuth, MemberClaim} from "../../types/types.js"

const noMessage = "no such void, or you're not a member"

export function secureMember<S extends Service>(
		space: Space,
		fn: (auth: MemberAuth) => S,
	) {

	return secure<ClaimToken, S>(async claimToken => {
		const {user, claim} = await authUser<MemberClaim>(claimToken)

		const v = await space.database.voids.get(claim.voidId)
		if (!v) throw new ExposedError(noMessage)

		const validMembership = v.members.includes(claim.member)
		if (!validMembership) throw new ExposedError(noMessage)

		return fn({
			user,
			member: claim.member,
			void: {...v, id: claim.voidId},
		})
	})
}

