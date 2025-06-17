
import {Kv} from "@e280/kv"
import {Nametag} from "@e280/authlocal/core"

export type Id = string
export type UserId = Id
export type VoidId = Id
export type BubbleId = Id
export type RoleId = Id
export type DropId = Id

export type Noid<T extends object> = Omit<T, "id">

/** arbitrary encrypted data */
export type Ciphertext = string

export type ClaimToken = string
export type UserClaim = {}
export type UserAuth = {user: Nametag}
export type MemberClaim = {voidId: VoidId, member: string}
export type MemberAuth = {member: string, void: Void} & UserAuth

export type Database = {
	vaults: Kv<VaultRecord>
	voids: Kv<VoidRecord>
	voidDrops: (voidId: VoidId) => Kv<DropRecord>
	drops: (voidId: VoidId, bubbleId: BubbleId) => Kv<DropRecord>
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
	memberships: Ciphertext
}

/** a community */
export type Void = {
	id: VoidId
	bulletin: Ciphertext
	members: Member[]
	roles: VoidRole[]
	bubbles: Bubble[]
}

/** a chat room */
export type Bubble = {
	id: BubbleId
	header: Ciphertext
	members: Member[]
	roles: BubbleRole[]
	children: BubbleId[]
}

/** an event in a chatroom, like a message or something */
export type Drop = {
	id: DropId
	time: number
	payload: Ciphertext
}

/** a membership key, 64 random hex characters */
export type Member = string

export type Priv = 1 | 0 | -1

export type VoidPrivs = {
	canUpdateVoid: Priv
	canDeleteVoid: Priv
	canWipeVoid: Priv
	canAdminRoles: Priv
	canAssignRoles: Priv
	canWriteBulletin: Priv
} & BubblePrivs

export type BubblePrivs = {
	canSeeBubbles: Priv
	canWriteHeader: Priv
	canReadDrops: Priv
	canPostDrops: Priv
	canDeleteDrops: Priv
}

export type Privileges = {[K in keyof VoidPrivs]: boolean}

export type VoidRole = {
	id: RoleId
	label: Ciphertext
	members: Member[]
	privs: VoidPrivs
}

export type BubbleRole = {
	id: RoleId
	label: Ciphertext
	members: Member[]
	privs: BubblePrivs
}

export type VaultRecord = Noid<Vault>
export type VoidRecord = {latestActivityTime: number} & Noid<Void>
export type BubbleRecord = Noid<Bubble>
export type DropRecord = Noid<Drop>

