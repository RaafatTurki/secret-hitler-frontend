<script>
import { membershipShow, roomClear, roomJoin, roomLeave, roomStart, vote, voteClear } from "$lib/socket"
import { r } from "$lib/store"

let name = $state("")
</script>

<main class="flex flex-col gap-2 xs:w-full md:w-1/2 m-2">

  <h1>room started: {$r.isStarted}</h1>

  <div class="section">
    <input class="input" type="text" bind:value={name}/>
    {#if $r.players.find(player => player.id === $r.selfId)}
      <input class="btn red" type="button" value="leave" onclick={() => roomLeave()}/>
    {:else}
      <input class="btn blue" type="button" value="join" onclick={() => roomJoin(name)}/>
    {/if}
  </div>

  <hr>

  <div class="section">
    <input class="btn red" type="button" value="yes" onclick={() => vote(true)}/>
    <input class="btn red" type="button" value="no" onclick={() => vote(false)}/>
  </div>

  <hr>

  <div class="section">
    <input class="btn blue" type="button" value="show" onclick={() => membershipShow($r.players[0].id)}/>
  </div>

  <hr>

  {#if $r.players.length > 0 && $r.players[0].id === $r.selfId}
    <div class="section">
      <input class="btn red" type="button" value="start" onclick={() => roomStart()}/>
      <input class="btn red" type="button" value="clear" onclick={() => roomClear()}/>
      <input class="btn red" type="button" value="vote_clear" onclick={() => voteClear()}/>
    </div>
  {/if}

  <hr>

  {#if $r.players.length > 0 && $r.players.every(player => player.vote != undefined)}
    {$r.players.filter(player => player.vote).length > ($r.players.length / 2) ? "success" : "failure"}
  {/if}

  {#each $r.players as player}
    <p>{player.id ?? ">:("}</p>
    <p>{player.name}</p>
    {#if player.membership}
      <p>membership: {player.membership}</p>
    {/if}
    {#if player.vote != undefined}
      <p>vote: {player.vote}</p>
    {/if}
    {#if player.isHitler}
      <p>is hitler</p>
    {/if}
    {#if player.isDead}
      <p>is dead</p>
    {/if}
    <br>
  {/each}

  {#each $r.shownMembership as playerId}
    <p>{playerId}</p>
  {/each}

</main>
