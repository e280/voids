
import {Time} from "@e280/authlocal/core"

export const constants = {
	seenLimit: 100,
	maxDropsPerVoid: 1024,
	dropLifespan: Time.hours(24),
	idleVoidLifespan: Time.days(30),
	appOrigin: "https://voids.e280.org",
	serverOrigin: "https://server.voids.e280.org",
}

