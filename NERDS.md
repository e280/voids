
# 🌌 voids — nerdy tech details
> **are you a normal?**  
> go back to the user-friendly [README.md](README.md)  

### storytime

**you, the user, logs in via authlocal.**
- we initiate an authlocal `loginDecrypt` popup flow
  - you select your desired identity
- voids retrieves or creates your encrypted `valet` keycard
  - the keycard is a private random seed
  - from it, we can derive your valet encryption key, decryption key, and symmetric key
- in the authlocal popup, you approve voids' decryption of the valet keycard
  - now the voids client stores the valet keycard alongside the login in localstorage
  - the keycard is ready for use so long as they are logged in

**the voids clientside retrieves your `vault`.**
- the vault is your personal account data
  - the server cannot read it, because it's encrypted with your valet keycard
  - ℹ️ server stores authlocal ids and their vaults, but is unable to know the contents of the vaults
- vaults are comprised of these sections:
  - `vault.contacts` — authlocal nametags of people you've added
  - `vault.memberships` — list of membership keys that permit your access the voids you've joined
  - `vault.inbox` — place where pending invites and other messages can reach you
    - ℹ️ anybody can encrypt items for your inbox using your valet public encryption key, without the server knowing

