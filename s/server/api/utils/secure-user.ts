
import {Service, secure} from "@e280/renraku"
import {authUser} from "./auth-user.js"
import {UserAuth, UserClaimToken} from "../../types.js"

export function secureUser<S extends Service>(fn: (auth: UserAuth) => S) {
	return secure<UserClaimToken, S>(async claimToken => fn({
		user: (await authUser(claimToken)).user
	}))
}

