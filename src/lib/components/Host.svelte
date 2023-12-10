<script lang="ts">
  import Image from "$lib/components/Image.svelte";

  export let host: any;
</script>
{#if host}
    <div class="host-square">
        <div class="horizontal-container">
            <div class="avatar-container">
                <Image id={host.avatar} width="100px" height="100px" design="round"/>
            </div>
            <p class="big-text">{host.forename} {host.alias ? `"${host.alias}" ` : ''}{host.surname ? host.surname : ''}</p>
        </div>
        <div class="horizontal-container">
            <div class="role-square">
                <p class="medium-text">{host.job.role}</p>
                <p class="small-text">{host.job.outlet.name}</p>
            </div>
        </div>
    </div>
{/if}

<style>

    .host-square {
        display: flex;
        flex-direction: column;
        width: 400px;
        height: 270px;
        border: 1px solid black;
        border-radius: 5px;
    }

    .horizontal-container {
        display: flex;
    }

    .avatar-container {
        padding: 0.5rem;
        /*border: 1px solid;*/
    }

    .big-text {
        margin: 0.5rem 0;
        font-size: large;
        font-weight: 700;
    }


</style>