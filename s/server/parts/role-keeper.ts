
import {MapG} from "@e280/stz"
import {Role, RoleEntry} from "./types.js"

export class RoleKeeper {
	#map = new MapG<string, Set<Role>>()

	constructor(assignments: RoleEntry[] = []) {
		for (const [userId, roleArray] of assignments) {
			const roleSet = new Set<Role>(roleArray)
			this.#map.set(userId, roleSet)
		}
	}

	get(userId: string): Set<Role> {
		return this.#map.guarantee(userId, () => new Set())
	}

	toAssignments(): RoleEntry[] {
		return [...this.#map]
			.filter(([,set]) => set.size > 0)
			.map(([userId, set]) => [userId, [...set]])
	}
}

