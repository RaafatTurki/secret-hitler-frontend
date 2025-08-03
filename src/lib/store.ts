import { writable } from 'svelte/store'

enum Membership {
  LIB,
  FAS,
}

interface Player {
  id: string
  name: string
  isHitler: boolean
  isDead: boolean
  membership: Membership
  vote?: boolean
}

interface RoomData {
  isStarted: boolean
  selfId?: string
  players: Player[]
  shownMembership: string[]
}

export const r = writable<RoomData>({
  isStarted: false,
  selfId: undefined,
  players: [],
  shownMembership: []
})
