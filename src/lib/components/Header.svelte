<script lang="ts">
	import { writable } from 'svelte/store';
	import GoSearch from 'svelte-icons/go/GoSearch.svelte';
	import GoGear from 'svelte-icons/go/GoGear.svelte';
	import posthog from 'posthog-js';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { liveState, nextShow } from '$lib/stores';

	const searchStore = writable('');
	const placeholderStore = writable('Search...');
	const searchExpanded = writable(false);
	const showDropdown = writable(false);
	const searchAvailable = writable(true);
	const menuExpanded = writable(false);

	showDropdown.set(posthog.getFeatureFlag('experiments-navbar-show-settings-cog') === true);
	searchAvailable.set(posthog.getFeatureFlag('experiments-navbar-search-enabled') === true);
	searchAvailable.subscribe((value) => {
		if (value === true) return placeholderStore.set('Search...');
		return placeholderStore.set('Search is currently disabled');
	});

	// eslint-disable-next-line no-undef
	let timer: NodeJS.Timeout;

	onDestroy(() => {
		if (browser) {
			if (timer) clearTimeout(timer);
		}
	});

	function openSearch(e: Event) {
		if ($searchExpanded === false) {
			timer = setTimeout(() => {
				if ($searchStore === '') searchExpanded.set(false);
			}, 15 * 1000);
			return searchExpanded.set(true);
		}
		if (!e.target) return console.log('Cannot close search when no target');
		let target = e.target as HTMLElement;
		let attribs = target.attributes;
		let type = attribs.getNamedItem('type');
		let disabled = attribs.getNamedItem('disabled');
		if (disabled) if (type.nodeValue !== 'text') return searchExpanded.set(false);
	}

	function openMenu() {
		if ($menuExpanded) return menuExpanded.set(false);
		menuExpanded.set(true);
	}
</script>

<div class="header">
	{#if $liveState !== null}
		{#if $liveState.imminence === 0}
			{#if $nextShow !== null}
				<div class="live-ticker">
					The next episode of The WAN Show is scheduled for {$nextShow.toLocaleString()}
				</div>
			{/if}
		{:else if $liveState.imminence === 1}
			<div class="live-ticker">
				{$liveState.title} - {$liveState.textImminence}
			</div>
		{:else if $liveState.imminence === 2}
			<div class="live-ticker">
				{$liveState.title} - {$liveState.textImminence}
			</div>
		{:else if $liveState.imminence === 3}
			<div class="live-ticker" style="background-color: var(--message-bar-urgent)">
				{$liveState.title} - {$liveState.textImminence}
			</div>
		{:else if $liveState.imminence === 4}
			<div class="live-ticker" style="background-color: var(--message-bar-urgent)">
				{$liveState.title} - {$liveState.textImminence}
			</div>
		{/if}
	{/if}
	<div class="header-container">
		<div class="dropdown-container">
			<button class="dropdown" on:click={openMenu}>
				<div class="icon">
					<GoGear />
				</div>
				<div class="dropdown-content" style={$menuExpanded ? 'display: flex;' : 'display: none;'}>
					<a href="/login">Sign In</a>
					<a href="/register">Sign Up</a>
				</div>
			</button>
		</div>
		<div class="centraliser">
			<ul>
				<li>
					<a href="/archive">
						<!--          <Icon name="i-fluent-mdl2:archive"/>-->
						Archives
					</a>
				</li>
				<li>
					<a href="/hosts">
						<!--          <Icon name="i-material-symbols:person-2-outline"/>-->
						Hosts
					</a>
				</li>
				<li>
					<a href="/sponsors">
						<!--          <Icon name="i-mdi:advertisements"/>-->
						Sponsors
					</a>
				</li>
				<li style="scale: 1.4; margin-top: 5px;">
					<a href="/">
						<img
							alt="The WAN Database"
							src="https://cdn.thewandb.com/assets/WANDB_darkBackground.svg"
							width="100"
						/>
					</a>
				</li>
				<li>
					<a href="/products">
						<!--          <Icon name="i-material-symbols:shopping-bag-outline"/>-->
						Products
					</a>
				</li>
				<li>
					<a href="/about">
						<!--          <Icon name="i-mdi:information-outline"/>-->
						About
					</a>
				</li>
				<li>
					<a href="/contact">
						<!--          <Icon name="i-material-symbols:person-2-outline"/>-->
						Contact
					</a>
				</li>
			</ul>
		</div>
		<button
			class="search"
			on:click={openSearch}
			style={$searchExpanded ? 'width: 300px;' : 'width: 42px;'}
		>
			<div
				class="icon"
				style={$searchExpanded
					? 'visibility: hidden; width: 0px'
					: 'visibility: visible; width: 42px'}
			>
				<GoSearch />
			</div>
			{#if $searchAvailable}
				<input
					placeholder={$placeholderStore}
					value={$searchStore}
					style={$searchExpanded ? 'width: 100%; margin: 0 0.75rem;' : 'width: 0px; margin: 0 0;'}
					type="text"
				/>
			{:else}
				<input
					placeholder={$placeholderStore}
					value={$searchStore}
					style={$searchExpanded ? 'width: 100%; margin: 0 0.75rem;' : 'width: 0px; margin: 0 0;'}
					type="text"
					disabled
				/>
			{/if}
		</button>
	</div>
</div>

<style>
	.header {
		backdrop-filter: blur(50px);
		position: sticky;
		z-index: 100;
		top: 0;
		padding-top: 5px;
	}

	.live-ticker {
		display: fled;
		background-color: var(--message-bar);
		color: #fff;
		padding: 10px;
		margin: 0 5px 5px;
		/*width: fit-content;*/
		border-radius: 5px;

		/*justify-content: center;*/
		justify-content: space-around;

		transition: 200ms ease-in-out;
	}

	.header-container {
		display: grid;
		grid-template-columns: 320px auto 320px;
		background-color: #000;
		color: #fff;
		padding: 10px 0;
		margin: 0 5px;
		/*width: fit-content;*/
		border-radius: 5px;

		/*justify-content: center;*/
		justify-content: space-around;

		transition: 200ms ease-in-out;
	}

	.header .search,
	.header .dropdown-container {
		display: flex;
		align-items: center;
		justify-content: center;
		/*min-width: 300px;*/
		height: 40px;
		background: hsl(0, 0%, 20%);
		border-radius: 20px;
		padding: 0 0.1rem;
		/*margin: 5px 0 5px 0;*/
		transition: 200ms;
		border: none;
		color: white;
	}

	.header .dropdown-container {
		width: 42px;
		margin: 5px auto 5px 10px;
	}

	.header .dropdown {
		width: 200px;
		height: fit-content;
		position: relative;
		display: inline-block;
		flex-direction: column;
		transition: 200ms all ease-in-out;
	}

	.dropdown-content {
		display: none;
		flex-direction: column;
		position: absolute;
		top: 40px;
		background-color: #f1f1f1;
		min-width: 200px;
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
		padding: 0;
		border-radius: 5px;
		z-index: 101;
		transition: 200ms all ease-in-out;
	}

	.dropdown-content a {
		/*margin: 0.5rem auto;*/
		font-size: medium;
		width: calc(100% - 10px);
		height: 50px;
		line-height: 50px;
		font-weight: 600;
		text-decoration: none;
		color: black;
		transition: 200ms ease-in-out;
		border-radius: 5px;
		margin: 5px;
	}

	.dropdown-content a:hover {
		background-color: #777777;
	}

	.header .dropdown-container button {
		border: none;
		background: transparent;
		color: white;
	}

	.header .search {
		margin: 5px 10px 5px auto;
	}

	.header .search > input {
		background: none;
		border: none;
		outline: none;
		color: white;
		/*width: 100%;*/
		font-size: 1rem;
		font-weight: 600;
		margin-right: 0.75rem;
		margin-left: 0.75rem;
		transition: 200ms;
	}

	.header .search > input:disabled {
		color: grey;
		font-weight: 400;
		cursor: not-allowed;
		text-align: center;
	}

	.header .search > input::placeholder {
		color: white;
		font-weight: 500;
	}

	.header .search > .icon,
	.header .dropdown > .icon {
		width: 22px;
		height: 22px;
		margin: 0 auto;
		transition: 200ms;
	}

	.header ul {
		/*position: relative;*/
		/*left: 0;*/
		/*transform: translateX(-10%);*/
		list-style: none;
		margin: 0 auto;
		min-width: 1000px;
		padding: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header ul li {
		display: inline-block;
		margin: 0 10px;
		font-size: 1.1em;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.header ul li a {
		color: #aaa;
		text-decoration: none;
		transition: 200ms ease-in-out;
	}

	.header ul li a:hover {
		color: #fff;
		text-decoration: underline;
		transition: 200ms ease-in-out;
	}
</style>
