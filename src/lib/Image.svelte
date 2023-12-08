<script lang="ts">
  import {writable} from "svelte/store";
  import {onMount} from 'svelte';
  import {decode} from "blurhash";
  import {v4} from "uuid";

  const nodeId: string = v4();

  export let id: string = 'id';
  export let width: string | number = '300px';
  export let height: string | number = '300px';
  export let fit: string = 'cover';
  export let design: string = 'semiround';

  let showImage = writable(false);

  let imageLoaded = () => {
    showImage.set(true);
  }


  let srcStore = writable('');

  onMount(async () => {
    let metadata = await fetch(`https://edge.thewandb.com/v2/cdn/${id}`)
      .then(res => res.json());

    srcStore.set(`https://cdn.thewandb.com/media/${id}.webp`);

    console.log(metadata);

    if (metadata.blur) {
      let canvas = document.getElementById(`canvas-${nodeId}`) as HTMLCanvasElement;
      if (!canvas) return;
      let ctx = canvas.getContext('2d');
      if (!ctx) return;
      let pixels = decode(metadata.blur, 4, 4);
      console.log(pixels)
      let image = ctx.createImageData(4, 4);
      image.data.set(pixels);
      console.log(image)
      ctx.putImageData(image, 0, 0, 0, 0, canvas.width, canvas.height);
    }
  });
</script>
<div class={design} style={`width: ${width}; height: ${height};`}>
    <canvas id={"canvas-" + nodeId} style={`object-fit: ${fit}; width: ${width}; height: ${height};`}/>
    <img alt="media" loading="lazy" on:load={imageLoaded} src={$srcStore}
         style={`opacity: ${$showImage ? 1: 0};visibility: ${$showImage ? 'visible': 'hidden'};object-fit: ${fit}; width: ${width}; height: ${height};`}/>
</div>
<style>
    .round {
        border-radius: 50%;
    }

    .semiround {
        border-radius: 10px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .square {
        border-radius: 2px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    div {
        padding: -1px;
        position: relative;
        overflow: hidden;
        width: fit-content;
        height: fit-content;
        border: 1px solid #eaeaea;
        transition: 200ms ease-in-out;
    }

    .semiround:hover,
    .square:hover {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.1);
        transition: 200ms ease-in-out;
    }

    div > canvas {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: inherit;
        z-index: 1;
    }

    div > img {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: inherit;
        z-index: 2;
    }
</style>