import { io } from "socket.io-client"
import { r } from "./store"

export const socket = io("http://11.111.8.21:3030")
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
    console.log("room:joined")
    r.update(state => {
      state.selfId = socket.id
      state.players = data.payload.room.players
      state.isStarted = data.payload.room.isStarted
      return state
    })
  }

  if (data.msg === "room:left") {
    console.log("room:left")
    r.update(room => {
      room.players = data.payload.room.players
      room.isStarted = data.payload.room.isStarted
      return room
    })
  }

  if (data.msg === "room:started") {
    console.log("room:started")
    r.update(r => {
      r.players = data.payload.room.players
      r.isStarted = true
      return r
    })
  }

  if (data.msg === "room:cleared") {
    console.log("room:cleared")
    clearRoomData()
  }

  if (data.msg === "voted") {
    console.log("room:voted")
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
    console.log("vote:result")
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
    console.log("membership:shown")
    r.update(r => {
      r.shownMembership.push(data.payload.playerId)
      return r
    })
  }

})


export function clearRoomData() {
  r.update(r => {
    r.selfId = undefined
    r.players = []
    r.isStarted = false
    r.shownMembership = []
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
