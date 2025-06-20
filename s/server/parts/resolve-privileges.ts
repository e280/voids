
import {Privileges, Role} from "../types/types.js"

export function resolvePrivileges(roles: Role[]) {
	const privileges: Privileges = {
		canPostDrops: false,
		canReadDrops: false,
		canSeeBubbles: false,
		canAdminRoles: false,
		canAssignRoles: false,
		canDeleteDrops: false,
		canDeleteVoid: false,
		canUpdateVoid: false,
		canWipeVoid: false,
		canWriteBulletin: false,
		canWriteHeader: false,
	}

	for (const role of roles) {
		for (const [key, value] of Object.entries(role.privileges))
			if (value)
				privileges[key as keyof Privileges] = true
	}

	return privileges
}

