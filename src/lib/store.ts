import { writable } from 'svelte/store'

export enum Membership {
  LIB = "LIB",
  FAS = "FAS",
}

export interface Player {
  id: string
  name: string
  isHitler: boolean
  membership: Membership
  vote?: boolean
}

export interface RoomData {
  isStarted: boolean
  selfId?: string
  players: Player[]
  shownMemberships: string[]
}

export const r = writable<RoomData>({
  selfId: undefined,
  isStarted: false,
  players: [],
  shownMemberships: []
})
