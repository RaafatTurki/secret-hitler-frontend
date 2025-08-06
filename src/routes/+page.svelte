<script lang="ts">
import {
  membershipShow,
  roomClear,
  roomJoin,
  roomLeave,
  roomStart,
  vote,
  voteClear,
} from "$lib/socket";
import { Membership, r } from "$lib/store";

let name = $state("")
let showMembershipButtonCounter = $state(3)

// player info
const player = $derived($r.players.find((player) => player.id === $r.selfId))

function getNameColor(membership: Membership) {
  if (membership == Membership.FAS) {
    return "text-red-500"
  } else if (membership == Membership.LIB) {
    return "text-blue-500"
  } else {
    return "text-slate-500"
  }
}

</script>

<div class="min-h-screen p-4 flex items-start justify-center">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-6 w-full max-w-2xl">
    <h1 class="text-5xl text-center mb-8 text-red-700 tracking-wide font-bold">SECRET HITLER</h1>

    <div class="section">

      <div class="section-h">
        <!-- room status -->
        {$r.isStarted ? "🎮 In Progress" : "⏳ Waiting to Start"}

        <div class="flex-grow"></div>

        <!-- room leave -->
        {#if player}
          <button onclick={() => roomLeave()}>❌</button>
        {/if}
      </div>

      <!-- player join -->
      {#if !player}
        <input class="input" type="text" placeholder="Enter your name to join the resistance..." bind:value={name} />
        <button class="btn primary" onclick={() => roomJoin(name)} disabled={!name.trim()}> 🔑 Join Game </button>
      {/if}

      <!-- admin controls -->
      {#if $r.players.length > 0 && $r.players[0].id === $r.selfId}
        {#if !$r.isStarted} <button class="btn primary" onclick={() => roomStart()}> 🎯 Start Game </button> {/if}
        <button class="btn secondary" onclick={() => roomClear()}> 🧹 Clear Room </button>
        <button class="btn secondary" onclick={() => voteClear()}> 🗳️ Clear Votes </button>
      {/if}
    </div>


    <!-- voting -->
    {#if $r.players.find((player) => player.id === $r.selfId) && $r.isStarted}
      <div class="section-title">🗳️ Voting</div>
      <div class="section-h">
        <button class="btn success w-full" onclick={() => vote(true)}> 👍🏻 Ja </button>
        <button class="btn primary w-full" onclick={() => vote(false)}> 🖕🏻 Nein </button>
      </div>
    {/if}

    <!-- vote results -->
    {#if $r.players.length > 0 && $r.players.every((player) => player.vote != undefined)}
      <div class="vote-result {$r.players.filter((player) => player.vote).length > $r.players.length / 2 ? 'success' : 'failure'}">
        {#if $r.players.filter((player) => player.vote).length > $r.players.length / 2}
          🎉 Vote Passed ({$r.players.filter((player) => player.vote).length}/{$r.players.length} votes)
        {:else}
          💥 Vote Failed ({$r.players.filter((player) => player.vote).length}/{$r.players.length} votes)
        {/if}
      </div>
    {/if}

    <!-- players list -->
    <div class="section-title">👥 Players ({$r.players.length})</div>
    <div class="grid grid-cols-1 gap-4">
      <!-- player list -->
      {#each $r.players as player}
        <div class="player-card flex flex-row 
          {player.vote != null ? player.vote ? "border-r-green-500" : "border-r-red-500" : "border-r-slate-500"}
          {player.id == $r.selfId ? "border-l-white" : "border-l-slate-500" }
          ">
          <span class={$r.shownMemberships.includes(player.id) ? getNameColor(player.membership) : ""}>
            {player.name}
            <!-- ID: {player.id ?? "Unknown"} -->

            {#if player.isHitler && $r.shownMemberships.includes(player.id)}
              <span class="text-red-500">卍</span>
            {/if}
          </span>

          <div class="flex-grow"></div>


          {#if player.id != $r.selfId}
            <input type="button" value={"🔍 " + showMembershipButtonCounter} onclick={() => {
              if (showMembershipButtonCounter > 0) {
                showMembershipButtonCounter--
              } else {
                membershipShow(player.id)
                showMembershipButtonCounter = 3
              }
            }} />
          {/if}

        </div>
      {/each}

      <!-- no players -->
      {#if $r.players.length == 0}
        <div class="col-span-full text-center py-8 text-gray-400">
          <div class="text-4xl mb-2">🏛️</div>
          <div>No players have joined yet...</div>
          <div class="text-sm mt-1">Be the first to join the resistance!</div>
        </div>
      {/if}
    </div>
  </div>
</div>
