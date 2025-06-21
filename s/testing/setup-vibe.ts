
import {Kv} from "@e280/kv"
import {Mock, Time} from "@e280/authlocal/mock"

import {constants} from "../constants.js"
import {makeRelay} from "../server/relay.js"
import {setupClientside} from "../server/api/clientside.js"
import {SeatClaim, SeatKey, UserClaim, VoidId} from "../server/types/types.js"

export function setupVibe() {
	const authlocal = new Mock({
		appOrigin: constants.appOrigin,
		authorityOrigin: "https://authlocal.org",
	})

	const relay = makeRelay(new Kv())

	const authenticate = async() => {
		const login = await authlocal.login()
		return {
			login,
			async signUserClaim() {
				return login.signClaim<UserClaim>({
					claim: {},
					expiresAt: Time.future.days(5),
					audience: constants.serverOrigin,
				})
			},
			async signSeatClaim(voidId: VoidId, seatKey: SeatKey) {
				return login.signClaim<SeatClaim>({
					claim: {voidId, seatKey},
					expiresAt: Time.future.days(5),
					audience: constants.serverOrigin,
				})
			},
		}
	}

	async function connect() {
		const clientside = setupClientside()
		return relay.accept(clientside)
	}

	return {relay, connect, authenticate}
}

