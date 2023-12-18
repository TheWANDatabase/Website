<script>

    import {writable} from "svelte/store";
    import {getVideos} from "$lib/api";
    import Video from "$lib/components/Video.svelte";
    import {onMount} from "svelte";

    let vods = writable([]);

    async function load() {
        let req = await getVideos()

        if (req.ok) {
            let videos = await req.json();
            vods.update((v) => {
                return v.concat(videos);
            })
        }
    }

    onMount(load)


</script>
<div class="container">
    <h1>Welcome to The Archive</h1>
    <div class="vod-container">
        {#each $vods as vod}
            <Video bind:vod={vod}/>
        {/each}
    </div>
</div>
<style>
    .container {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .vod-container {
        margin: 1rem 0 3rem;
        width: 100%;
        justify-content: center;
        display: grid;
        grid-template-columns: repeat(auto-fit, 400px);
        grid-gap: 20px;
    }
</style>