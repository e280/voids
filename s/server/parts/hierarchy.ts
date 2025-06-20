
import {dedupe, MapG} from "@e280/stz"
import {resolvePrivileges} from "./resolve-privileges.js"
import {BubbleId, HierarchyData, HierId, HierNode, Privileges, Role, RoleId, SeatId} from "../types/types.js"

export class Hierarchy {
	root: HierId
	roles = new MapG<RoleId, Role>()
	nodes = new MapG<HierId, HierNode>()
	ancestors = new MapG<HierId, HierNode[]>()

	constructor(original: HierarchyData) {
		const data = structuredClone(original)

		this.root = data.root

		for (const role of data.roles)
			this.roles.set(role.id, role)

		for (const node of data.nodes)
			this.nodes.set(node.id, node)

		for (const [node, ancestors] of this.walk())
			this.ancestors.set(node.id, ancestors)
	}

	*walk(
			id: HierId = this.root,
			path: HierNode[] = [],
		): Generator<[node: HierNode, path: HierNode[]]> {

		const node = this.nodes.require(id)
		yield [node, path]

		if ("children" in node) {
			for (const childId of node.children)
				yield* this.walk(childId, [...path, node])
		}
	}

	findNodeForBubble(bubbleId: BubbleId) {
		for (const node of this.nodes.values()) {
			if ("bubbleId" in node && node.bubbleId === bubbleId)
				return node
		}
		throw new Error("bubble not found in hierarchy")
	}

	resolveRoles(id: HierId, seatId: SeatId) {
		const roles = new Set<Role>()
		const path = [...this.ancestors.require(id), this.nodes.require(id)]

		for (const node of path) {
			if ("assignments" in node) {
				for (const [roleId, seatIds] of node.assignments) {
					const isAssigned = seatIds.includes(seatId)
					if (isAssigned) {
						const role = this.roles.require(roleId)
						roles.add(role)
					}
				}
			}
		}

		return roles
	}

	resolvePrivileges(id: HierId, seatId: SeatId): Privileges {
		const roles = this.resolveRoles(id, seatId)
		return resolvePrivileges([...roles])
	}

	toData(): HierarchyData {
		return structuredClone({
			root: this.root,
			roles: [...this.roles.values()],
			nodes: dedupe([...this.walk()].map(([node]) => node)),
		})
	}
}

