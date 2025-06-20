
import {Kv, Store} from "@e280/kv"
import {Nametag} from "@e280/authlocal/core"

export type Stats = {
	voidCount: number
	pruneTime: number
}

/** 64 character hex string */
export type Id = string

export type UserId = Id
export type VoidId = Id
export type BubbleId = Id
export type RoleId = Id
export type DropId = Id
export type TicketId = Id
export type HierId = Id

/** public hash of the seat key */
export type SeatId = Id

/** private membership key, 64 random hex characters */
export type SeatKey = string

export type Noid<T extends object> = Omit<T, "id">

/** base64url encrypted data, opaque to the server, only the clients know what's inside */
export type Ciphertext = string

export type UserClaimToken = string
export type SeatClaimToken = string

/** intentionally empty, user login claims don't need any custom data */
export type UserClaim = {}

/** user login with a claim to a specific seat in a specific void */
export type SeatClaim = {voidId: VoidId, seatKey: SeatKey}

/** verified user that is logged in */
export type UserAuth = {user: Nametag}

/** verified user that is logged in, and has a seat at the specified void */
export type SeatAuth = {seatKey: SeatKey, seatId: SeatId, void: Void} & UserAuth

export type Database = {
	kv: Kv,
	vaults: Kv<VaultRecord>
	voids: Kv<VoidRecord>
	void: (voidId: VoidId) => {
		self: Store<VoidRecord>
		tickets: Kv<TicketRecord>
		drops: Kv<DropRecord>
		bubble: (bubbleId: BubbleId) => {
			drops: Kv<DropRecord>
		}
	}
}

/** user's account data */
export type Vault = {

	/** this vault is identified by the authlocal user id */
	id: UserId

	/** seed for the user's voids keys, only decryptable by the user on authlocal */
	keycard: Ciphertext

	/** invites from other users */
	invites: Ciphertext[]

	/** user's membership data */
	seats: Ciphertext
}

/** a community */
export type Void = {
	id: VoidId
	bulletin: Ciphertext
	seats: Seat[]
	bubbles: Bubble[]
	hierarchy: HierarchyData
	bans?: Ciphertext
}

/** a chat room */
export type Bubble = {
	id: BubbleId
	header: Ciphertext
	seats: SeatId[]
}

/** a participant in a void */
export type Seat = {
	id: SeatId
	joinedTime: number
}

/** hierarchy describes the structure of how roles flow and ux for how bubbles are organized */
export type HierarchyData = {
	root: HierId
	nodes: HierNode[]
	roles: Role[]
}
export type HierNode = HierBranch | HierBubble
export type HierBasics = {
	id: HierId
	label: Ciphertext
}
export type HierBranch = {
	assignments: RoleAssignment[]
	children: HierId[]
} & HierBasics
export type HierBubble = {
	bubbleId: BubbleId
} & HierBasics

/** an event in a chatroom, like a message or something */
export type Drop = {
	id: DropId
	time: number
	seatId: SeatId
	payload: Ciphertext

	/** if provided, this drop can expire sooner than the global setting */
	lifespan: number | null
}

export type Ticket = TicketUpdate & TicketServerside

export type TicketUpdate = {
	id: TicketId
	remaining: number | null
	expiresAt: number | null
	captcha: boolean
}

export type TicketServerside = {
	uses: number
	timeCreated: number
	timeLastUsed: number
}

export type VoidPrivileges = {
	canUpdateVoid: boolean
	canDeleteVoid: boolean
	canWipeVoid: boolean
	canAdminRoles: boolean
	canAssignRoles: boolean
	canWriteBulletin: boolean
}

export type BubblePrivileges = {
	canSeeBubbles: boolean
	canWriteHeader: boolean
	canReadDrops: boolean
	canPostDrops: boolean
	canDeleteDrops: boolean
}

export type Privileges = {[K in keyof (VoidPrivileges & BubblePrivileges)]: boolean}

export type Role = {
	id: RoleId
	label: Ciphertext
	privileges: Partial<VoidPrivileges & BubblePrivileges>
}

export type RoleAssignment = [roleId: RoleId, seatIds: SeatId[]]

export type VaultRecord = Noid<Vault>
export type VoidRecord = {latestActivityTime: number} & Noid<Void>
export type BubbleRecord = Noid<Bubble>
export type DropRecord = Noid<Drop>

export type TicketRecord = Noid<Ticket>

export type VoidPulse = {
	voidId: VoidId
	v: Void | null
}

export type DropPulse = {
	voidId: VoidId
	bubbleId: BubbleId
	dropId: DropId
	drop: Drop | null
}

