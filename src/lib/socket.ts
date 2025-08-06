import { io } from "socket.io-client"
import { Membership, r, type Player } from "./store"

// export const socket = io("http://11.111.8.21:3030")
export const socket = io("http://11.111.6.11:3030")
// export const socket = io("http://localhost:3030")

socket.on("connect", () => {
  console.log("connected")
})

socket.on("disconnect", () => {
  console.log("disconnected")
  socket.disconnect()
})

socket.on("event", (data) => {
  console.log(data)

  if (data.msg === "room:joined") {
    r.update(state => {
      state.selfId = socket.id
      state.players = data.payload.room.players
      state.isStarted = data.payload.room.isStarted
      return state
    })
  }

  if (data.msg === "room:left") {
    r.update(room => {
      room.players = data.payload.room.players
      room.isStarted = data.payload.room.isStarted
      return room
    })
  }

  if (data.msg === "room:started") {
    let shownMemberships: string[] = []

    const player: Player = data.payload.room.players.find((player: Player) => player.id === socket.id)
    if (player) {
      if (player.membership == Membership.LIB || (player.isHitler && data.payload.room.players.length > 5)) {
        shownMemberships.push(player.id)
      } else {
        shownMemberships = data.payload.room.players.map((player: Player) => player.id)
        // .filter((player: Player) => player.membership == Membership.FAS)
      }
    }

    r.update(r => {
      r.players = data.payload.room.players
      r.isStarted = true
      r.shownMemberships = shownMemberships
      return r
    })
  }

  if (data.msg === "room:kicked") {
    r.update(r => {
      r.players = data.payload.room.players
      r.isStarted = true
      return r
    })
  }

  if (data.msg === "room:cleared") {
    clearRoomData()
  }

  if (data.msg === "voted") {
    r.update(r => {
      r.players.forEach(player => {
        if (player.id === socket.id) {
          player.vote = data.payload.vote
        }
      })
      return r
    })
  }

  if (data.msg === "vote:result") {
    r.update(r => {
      r.players = data.payload.room.players
      r.isStarted = data.payload.room.isStarted
      return r
    })
  }

  if (data.msg === "vote:cleared") {
    r.update(r => {
      r.players = r.players.map(player => {
        player.vote = undefined
        return player
      })
      return r
    })
  }

  if (data.msg === "membership:shown") {
    r.update(r => {
      r.shownMemberships.push(data.payload.playerId)
      return r
    })
  }

})


export function clearRoomData() {
  r.update(r => {
    r.selfId = undefined
    r.players = []
    r.isStarted = false
    r.shownMemberships = []
    return r
  })
}

export function roomJoin(name: string) {
  socket.emit("event", {
    msg: "room:join",
    payload: {
      name
    }
  })
}

export function roomLeave() {
  socket.emit("event", {
    msg: "room:leave"
  })
  clearRoomData()
}

export function roomStart() {
  socket.emit("event", {
    msg: "room:start"
  })
}

export function roomKick(playerId: string) {
  socket.emit("event", {
    msg: "room:kick",
    payload: {
      playerId
    }
  })
}

export function roomClear() {
  socket.emit("event", {
    msg: "room:clear"
  })
}

export function vote(vote: boolean) {
  socket.emit("event", {
    msg: "vote",
    payload: {
      vote
    }
  })
}

export function voteClear() {
  socket.emit("event", {
    msg: "vote:clear",
  })
}

export function membershipShow(playerId: string) {
  socket.emit("event", {
    msg: "membership:show",
    payload: {
      playerId
    }
  })
}
