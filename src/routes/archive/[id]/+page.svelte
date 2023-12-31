<script lang="ts">
	import { getVideos } from '$lib/api';
	import Image from '$lib/components/Image.svelte';
	import Player from '$lib/components/Player.svelte';
	import { onMount, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';
	import { writable } from 'svelte/store';

	export let data;
</script>

<div class="container">
	<title>{data.title} | The WAN Database</title>
	<div class="player">
		<Player bind:vod={data} />
	</div>
	<div class="details">
		<h1 style="grid-area:title;">{data.title}</h1>
		<h2 style="grid-area:aired;margin-left:auto;width:fit-content;">
			Originally Aired {new Date(data.aired).toLocaleDateString()} at {new Date(
				data.aired
			).toLocaleTimeString()}
		</h2>
		<h5 style="grid-area:runtime;margin-left:auto;width:fit-content;">
			Runtime: {Math.round(data.duration / 60)} mins (approx)
		</h5>
	</div>
	<div class="content">
		<div class="product-container">
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
									<span class="badge">Launch Week</span>
								</div>
							{:else if product.retired}
								<span class="price">${product.standardPrice}</span>
								<div class="product-badges">
									<span class="badge">Discontinued</span>
								</div>
							{:else if product.isOnSale}
								<span class="price">${product.salePrice}</span>
								<div class="product-badges">
									<span class="badge">Sale</span>
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
		grid-template-columns: 1335px auto 5px;
		grid-template-areas:
			'player content blank'
			'details content blank';
	}

	.player {
		border-radius: 5px;
		border: 0;
		overflow: hidden;
		grid-area: player;
		width: 100%;
		height: auto;
		aspect-ratio: 16/9;
	}

	.details {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 5px 10px;
		margin: 5px 0;
		border-radius: 5px;
		grid-area: details;
		width: 100%;
		display: grid;
		grid-template-areas:
			'title aired'
			'description runtime';
	}

	.content {
		background-color: rgba(0, 0, 0, 0.1);
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
		background-color: rgba(0, 0, 0, 0.05);
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
		border: 1px solid rgba(110, 0, 0, 0.75);
		border-radius: 5px;
		background: rgba(110, 0, 0, 0.5);
	}
</style>
