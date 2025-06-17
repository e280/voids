
import {Service, secure} from "@e280/renraku"
import {authUser} from "./auth-user.js"
import {ClaimToken, UserAuth} from "../../types/types.js"

export function secureUser<S extends Service>(fn: (auth: UserAuth) => S) {
	return secure<ClaimToken, S>(async claimToken => fn({
		user: (await authUser(claimToken)).user
	}))
}

