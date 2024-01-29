<script>

    import {writable} from "svelte/store";
    import {getHosts} from "$lib/api";
    import Host from "$lib/components/Host.svelte";
    import {onMount} from "svelte";

    let hosts = writable([]);

    async function load() {
        let req = await getHosts()

        if (req.ok) {
            let videos = await req.json();
            hosts.update((v) => {
                return v.concat(videos);
            })
        }
    }

    onMount(load)


</script>
<div class="container">
    <h1>Hosts</h1>
    <p>This page is a list of every person who has ever hosted, been phoned, or been present on the show.</p>
    <div class="host-container">
        {#each $hosts as host}
            <Host bind:host={host}/>
        {/each}
    </div>
</div>
<style>
    .container {
        padding-top: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .host-container {
        margin: 1rem 0 3rem;
        width: 100%;
        justify-content: center;
        display: grid;
        grid-template-columns: repeat(auto-fit, 400px);
        grid-gap: 20px;
    }
</style>