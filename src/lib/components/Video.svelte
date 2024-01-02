<script lang="ts">
  import Image from "$lib/components/Image.svelte";

  export let vod: never;

</script>
{#if vod !== null}
    <a class="video-container" href={`/archive/`+vod.id}>
        <Image id={vod.thumbnail} width="100%" height="230px" design="thumbnail"/>
        <div class="horizontal-container">
            <p>{vod.title}</p>
        </div>
    </a>
{/if}

<style>
    .video-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 300px;
        border: 1px solid black;
        border-radius: 5px;
        padding: -2px;
        color: inherit;
        text-decoration: none;
    }

    .horizontal-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .horizontal-container > p {
        text-align: center;
        width: 100%;
        font-weight: 700;
        font-size: 18pt;
    }
</style>