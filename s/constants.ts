
import {Time} from "@e280/authlocal/core"

export const constants = {
	peekerLimit: 32,
	maxDropsPerVoid: 1024,
	dropLifespan: Time.days(7),
	peekerLifespan: Time.days(7),
	idleVoidLifespan: Time.days(30),
	appOrigin: "https://voids.e280.org",
	serverOrigin: "https://server.voids.e280.org",
}

