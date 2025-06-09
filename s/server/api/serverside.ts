
import {validLabel, verifyClaim} from "@e280/authlocal/core"
import {Authorize, ExposedError, secure} from "@e280/renraku"

import {Nest} from "../parts/nest.js"
import {Follower} from "../parts/follower.js"
import {constants} from "../../constants.js"
import {AuthClaim, Clientside, Serverside} from "./schema.js"

export const setupServerside = (
		nest: Nest,
		follower: Follower,
		_clientside: Clientside,
	): Serverside => ({

	anon: {
		async getCarton(id) {
			return nest.getCarton(id)
		},
		async followCarton(id) {
			follower.followCarton(id)
		},
		async unfollowCarton(id) {
			follower.unfollowCarton(id)
		},
		async getEggs(cartonId) {
			return nest.getEggs(cartonId)
		},
	},

	user: secure(async auth => {
		const {proof} = await verifyClaim<AuthClaim>({
			claimToken: auth.claimToken,
			appOrigins: [constants.appOrigin],
			allowedAudiences: [constants.serverOrigin],
		})
		return <Authorize<Serverside["user"]>>{

			async createCarton(id: string, label: string) {
				if (!validLabel(label))
					throw new ExposedError("invalid label")
				return nest.createCarton({
					id,
					label,
					ownerId: proof.nametag.id,
					latestActivityTime: Date.now(),
				})
			},

			async addEgg(cartonId: string, payload: string) {
				return nest.addEgg(cartonId, payload)
			},
		}
	})
})

