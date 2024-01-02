<script lang="ts">
	import { getVideos } from '$lib/api';
	import Image from '$lib/components/Image.svelte';
	import Player from '$lib/components/Player.svelte';
	import Host from '$lib/components/Host.svelte';
	import { toHumanTime } from '$lib/time';
	import {
		currentTime,
		preshowOffset,
		playing,
		playbackSource,
		adjustedTime,
		maxDuration
	} from '$lib/stores.js';
	import { onMount, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';
	import { writable } from 'svelte/store';

	export let data;

	$preshowOffset = data.preShowOffset;

	onDestroy(() => {
		if(typeof window !== "undefined") {

		}
	})
</script>

<div class="container">
	<title>{$playing ? '▶' : '⏸'} {data.title} | The WAN Database</title>
	<div class="player">
		<Player bind:vod={data} />
		<div class="details">
			<h1 style="grid-area:title;">{data.title}</h1>
			<h2 style="grid-area:aired;margin-left:auto;width:fit-content;">
				Originally Aired {new Date(data.aired).toLocaleDateString()} at {new Date(
					data.aired
				).toLocaleTimeString()}
			</h2>
			<h5 style="grid-area:runtime;margin-left:auto;width:fit-content;">
				Runtime: {Math.round(data.duration / 60)} mins (approx) - Currently: {toHumanTime(
					$adjustedTime
				)} / {toHumanTime($maxDuration)}
			</h5>
		</div>
		<div class="cast">
			{#if data.cast.length > 0}
				{#each data.cast as host}
					<Host bind:host={host}/>
				{/each}
			{:else}
				<p>Cast Not Available</p>
			{/if}
		</div>
	</div>
	
	<div class="content">
		<div class="product-container">
			<h2>Topics</h2>
			{#if data.topics.length > 0}
				<div class="topic-list">
					{#each data.topics as topic}
						<div class="primaryTopic">
							<h4>{topic.title}</h4>
							<div><span>{toHumanTime(topic.start)}</span> | <span>{toHumanTime(topic.end - topic.start)}</span></div>
							{#if topic.children !== undefined}
								{#each topic.children as child}
									<div class="secondaryTopic">
										<h5>{child.title}</h5>
									</div>
								{/each}
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<p>Topics Not Available</p>
			{/if}
			<hr />
			<h2>Products On Show</h2>
			{#if data.products.length > 0}
				<div class="product-list">
					{#each data.products as product}
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
		padding: 0 5px;
		/* background-color: pink; */
		min-height: 100%;
		margin: 10px auto auto;
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

	.cast {
		margin-top: 5px;
		display: flex;
		/* justify-content: ; */
		flex-wrap: wrap;
		align-items: flex-start;	
	}

	.cast > * {
		margin: 5px auto;
	}

	.content {
		background-color: rgb(var(--bg-secondary));
		padding: 5px 10px;
		margin: 0 5px 5px 5px;
		border-radius: 5px;
		grid-area: content;
		width: 100%;
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
