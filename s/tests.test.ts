
import {Science, test, expect} from "@e280/science"
import {setupVibe} from "./testing/setup-vibe.js"
import {makeVoid} from "./client/parts/make-void.js"
import {FakeCryption} from "./client/testing/fake-cryption.js"

await Science.run({
	"server": Science.suite({
		"stats": test(async() => {
			const vibe = setupVibe()
			const {serverside} = await vibe.connect()
			const stats = await serverside.stats()
			expect(stats.voidCount).is(0)
		}),

		"create a void": test(async() => {
			const vibe = setupVibe()
			const {serverside} = await vibe.connect()

			const auth = await vibe.authenticate()
			const userClaim = await auth.signUserClaim()

			const cryption = await FakeCryption.generate()
			const v = await makeVoid(cryption)

			await serverside.void.create(userClaim, v)
		}),
	}),
})

