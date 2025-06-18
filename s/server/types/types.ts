
import {Kv} from "@e280/kv"
import {Nametag} from "@e280/authlocal/core"

export type Id = string
export type UserId = Id
export type VoidId = Id
export type BubbleId = Id
export type RoleId = Id
export type DropId = Id
export type TicketId = Id
export type HierId = Id

/** just a hash of the seat key */
export type SeatId = Id

export type Noid<T extends object> = Omit<T, "id">

/** arbitrary encrypted data */
export type Ciphertext = string


export type UserClaimToken = string
export type UserClaim = {}
export type UserAuth = {user: Nametag}

export type SeatClaimToken = string
export type SeatClaim = {voidId: VoidId, seatKey: string}
export type SeatAuth = {seatKey: string, seatId: string, void: Void} & UserAuth

export type Database = {
	vaults: Kv<VaultRecord>
	voids: Kv<VoidRecord>
	voidDrops: (voidId: VoidId) => Kv<DropRecord>
	drops: (voidId: VoidId, bubbleId: BubbleId) => Kv<DropRecord>
	tickets: (voidId: VoidId) => Kv<TicketRecord>
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
	seats: SeatId[]
	roles: Role[]
	bubbles: Bubble[]
	hierarchy: Hierarchy
	bans?: Ciphertext
}

/** a chat room */
export type Bubble = {
	id: BubbleId
	header: Ciphertext
	seats: SeatId[]
}

/** hierarchy describes the structure of how roles flow and ux for how bubbles are organized */
export type Hierarchy = HierNode[]
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

	/** self-delete sooner than the global setting */
	lifespan: number | null
}

export type Ticket = TicketUpdate & TicketServerside

export type TicketUpdate = {
	id: TicketId
	remaining: number | null
	captcha?: boolean
}

export type TicketServerside = {
	uses: number
	timeCreated: number
	timeLastUsed: number
}

/** private membership key, 64 random hex characters */
export type SeatKey = string

/** public hash of the seat key */

export type VoidPrivs = {
	canUpdateVoid: boolean
	canDeleteVoid: boolean
	canWipeVoid: boolean
	canAdminRoles: boolean
	canAssignRoles: boolean
	canWriteBulletin: boolean
}

export type BubblePrivs = {
	canSeeBubbles: boolean
	canWriteHeader: boolean
	canReadDrops: boolean
	canPostDrops: boolean
	canDeleteDrops: boolean
}

export type Privileges = {[K in keyof (VoidPrivs & BubblePrivs)]: boolean}

export type Role = {
	id: RoleId
	label: Ciphertext
	privs: Partial<VoidPrivs & BubblePrivs>
}

export type RoleAssignment = [id: RoleId, SeatId[]]

export type VaultRecord = Noid<Vault>
export type VoidRecord = {latestActivityTime: number} & Noid<Void>
export type BubbleRecord = Noid<Bubble>
export type DropRecord = Noid<Drop>

export type TicketRecord = Noid<Ticket>

