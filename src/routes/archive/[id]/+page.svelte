<script lang="ts">
	import { getVideos } from '$lib/api';
	import Image from '$lib/components/Image.svelte';
	import Player from '$lib/components/Player.svelte';
  import Host from '$lib/components/Host.svelte';
  import Sponsor from "$lib/components/Sponsor.svelte";
	import { toHumanTime } from '$lib/time';
	import {
		preshowOffset,
		playing,
		adjustedTime,
		maxDuration,
		pageTitle,
		pageImage
	} from '$lib/stores.js';

	import Topic from '$lib/components/Topic.svelte';
	import type { CachedEntity, Episode } from '$lib/types/api.js';
	import SchemaOrg from '$lib/components/SchemaOrg.svelte';

	export let data: CachedEntity<Episode>;

	export let { cached, data: episode, queryTime } = data as any;

	console.debug(`==== Fetch Report ====\nCached: ${cached}\nQuery Time: ${queryTime}ms`);
  console.debug("page.svelete - ", episode);
	$preshowOffset = episode.preShowOffset ?? 0;
	$pageTitle = `${episode.title} | The WAN Database`;
	$pageImage = `https://cdn.thewandb.com/media/${episode.thumbnail}.webp`;
</script>

<svelte:head>
	<script src="https://www.youtube.com/iframe_api"></script>
	<SchemaOrg
		schemaOrgObject={{
			'@context': 'https://schema.org',
			'@type': 'VideoObject',
			name: episode.title,
			description: episode.description,
			embedUrl: `https://www.youtube.com/embed/${episode.id}`,
			thumbnailUrl: `https://cdn.thewandb.com/assets/${episode.thumbnail}.webp`,
			uploadDate: new Date(episode.aired).toISOString()
		}}
	/>
</svelte:head>
<div class="container">
	<div class="player">
		<Player bind:vod={episode} />
		<div class="details">
			<h1 style="grid-area:title;">{episode.title}</h1>
			<h2 style="grid-area:aired;margin-left:auto;width:fit-content;">
				Originally Aired {new Date(episode.aired).toLocaleDateString()} at {new Date(
					episode.aired
				).toLocaleTimeString()}
			</h2>
			<h5 style="grid-area:runtime;margin-left:auto;width:fit-content;">
				Runtime: {Math.round(episode.duration / 60)} mins (approx) - Currently: {toHumanTime(
					$adjustedTime
				)} / {toHumanTime($maxDuration)}
			</h5>
    </div>
    <h3>Sponsors</h3>
    <div class="sponsors">
      {#if episode.sponsors.length > 0}
        <div class="sponsorContainer">
          {#each episode.sponsors as sponsor}
            <Sponsor bind:sponsor />
          {/each}
        </div>
      {:else}
        <p>No Sponsors Available</p>
      {/if}
    </div>
    <hr />
    <h3>Cast</h3>
		<div class="cast">
			{#if episode.cast.length > 0}
				<div class="castContainer">
					{#each episode.cast as host}
						<Host bind:host />
					{/each}
				</div>
			{:else}
				<p>Cast Not Available</p>
			{/if}
		</div>
	</div>

	<div class="content">
		<div class="product-container">
			<h2>Topics</h2>
			{#if episode.topics.length > 0}
				<div class="topic-list">
					{#each episode.topics as topic, index}
						<Topic {topic} />
						{#if index < episode.topics.length - 1}
							<hr />
						{/if}
					{/each}
				</div>
			{:else}
				<p>Topics Not Available</p>
			{/if}
			<hr />
			<h2>Products On Show</h2>
			{#if episode.products.length > 0}
				<div class="product-list">
					{#each episode.products as product}
						<a
							id={'lttstore_product_' + product.id}
							class="product"
							href={`https://lttstore.com/products/${product.productId}`}
							target="_blank"
						>
							<Image id={product.media[0].imageId} width="230px" height="230px" />
							<h4>{product.title}</h4>
							{#if product.link.isLaunch}
								<span class="price">${product.standardPrice}</span>
								<div class="product-badges">
									<span class="badge primary">Launch Week</span>
								</div>
							{:else if product.retired}
								<span class="price">${product.standardPrice}</span>
								<div class="product-badges">
									<span class="badge disabled">Discontinued</span>
								</div>
							{:else if product.isOnSale}
								<span class="price">${product.salePrice}</span>
								<div class="product-badges">
									<span class="badge important">Sale</span>
								</div>
							{:else}
								<span class="price">${product.standardPrice}</span>
							{/if}
						</a>
					{/each}
				</div>
			{:else}
				<h4>This episode is missing product information.</h4>
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		min-height: 100vh;
		padding: 0;
		margin: 5px;
		padding-top: 75px;
		display: grid;
		grid-template-columns: auto 570px 5px;
		grid-template-rows: 76vh auto;
		grid-template-areas:
			'player content'
			'player content';
	}

	.player {
		border-radius: 5px;
		border: 0;
		overflow: hidden;
		grid-area: player;
		margin: 0 5px 0 0;
	}

	.details {
		background-color: rgb(var(--bg-secondary));
		padding: 5px 10px;
		margin: 5px 0 auto;
		border-radius: 5px;
		width: 100%;
		display: grid;
		grid-template-areas:
			'title aired'
			'description runtime';
	}

  .sponsorContainer,
	.castContainer {
		margin-top: 5px;
		display: grid;
		width: 100%;
    grid-template-columns: repeat(auto-fit, 33.33%);
    grid-template-rows: min-content;
	}

  .sponsorContainer {
    grid-template-columns: repeat(auto-fit, 50%) !important;
  }


	.content {
		background-color: rgb(var(--bg-secondary));
		padding: 5px 10px;
		margin: 0 5px 5px 5px;
		border-radius: 5px;
		grid-area: content;
		width: 100%;
	}

	.content .topic-list {
		height: 70vh;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.content .product-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}

	.content .product-container h2,
	.content .product-container h4 {
		text-align: center;
		width: 100%;
	}

	.content .product-container .product-list {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.content .product-container .product-list .product {
		background-color: rgb(var(--bg-tertiary));
		border-radius: 5px;
		padding: 10px 0;
		width: 260px;
		margin: 10px 7px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		color: inherit;
	}

	.content .product-container .product-list .product .product-badges {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}

	.content .product-container .product-list .product .product-badges .badge {
		font-size: small;
		padding: 5px 10px;
		border-radius: 5px;
	}

	.primary {
		border: 1px solid rgba(var(--primary), 0.9);
		background: rgba(var(--primary), 0.5);
	}

	.disabled {
		border: 1px solid rgba(var(--greyscale), 0.9);
		background: rgba(var(--greyscale), 0.5);
	}

	.important {
		border: 1px solid rgba(var(--message-bar-urgent), 0.9);
		background: rgba(var(--message-bar-urgent), 0.5);
	}
</style>
