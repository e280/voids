
import {verifyClaim} from "@e280/authlocal/core"
import {constants} from "../../../constants.js"

export async function authUser<C>(claimToken: string) {
	const {proof, claim} = await verifyClaim<C>({
		claimToken: claimToken,
		appOrigins: [constants.appOrigin],
		allowedAudiences: [constants.serverOrigin],
	})
	return {user: proof.nametag, claim}
}

