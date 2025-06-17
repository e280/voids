
import {Time} from "@e280/authlocal/core"

export const constants = {
	maxVoidMembers: 4096,
	maxInvites: 10,
	peekerLimit: 32,
	maxDropsPerVoid: 1024,
	dropLifespan: Time.days(8),
	peekerLifespan: Time.days(8),
	idleVoidLifespan: Time.days(32),
	appOrigin: "https://voids.e280.org",
	serverOrigin: "https://server.voids.e280.org",
}

