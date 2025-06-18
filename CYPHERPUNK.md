
# 🌌 voids — cypherpunk tech deets
> **wait, are you a normal?** go read the [README.md](README.md)  

> [!IMPORTANT]
> ***WIP*** — this is super incomplete rn

### cool ideas

**the *"i was not here"* button.**  
it wipes all your messages and revokes your membership from a void..  
your presence and history is scrubbed from that void, leaving no trace..  

**three kinds of drops**  
anon drops are messages with no authlocal attribution, just your seat id..  
unsigned drops show authlocal id, but could be forged (unlocked icon)..  
signed drops show authlocal id, and cannot be forged (locked icon)..  


### vault

**you, the user, login via authlocal.**
- we initiate an authlocal `loginDecrypt` popup flow
  - you select your desired identity
- voids server retrieves or creates your encrypted `valet` keycard
  - the keycard is a private random seed
  - from it, we can derive your valet encryption key, decryption key, and symmetric key
  - the server stores your public valet encryption key, which is queryable for your authlocal id, so that other users can encrypt invites to you (without the server being able to decrypt it)
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

### voids and bubbles

