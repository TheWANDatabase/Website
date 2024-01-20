<script lang="ts">
	import { getVideos } from '$lib/api';
	import Player from '$lib/components/Player.svelte';
	import Topic from '$lib/components/Topic.svelte';
	import { processTimestampDocument } from '$lib/editor';
	import { currentTime, liveState } from '$lib/stores';
	import { toHumanTime } from '$lib/time';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	let vod = writable<any>();
	let topics: Writable<any[]> = writable([]);
	let editor: Writable<HTMLTextAreaElement> = writable();
	let editorContent = writable('-Timestamps-\n[0:00] *Chapters*');

	onMount(async () => {
		if (typeof window !== 'undefined') {
			$editorContent = window.localStorage.getItem('wdb.ec') || '-Timestamps-\n[0:00] *Chapters*';

			window.onkeydown = (e) => {
				console.log(e.ctrlKey, e.shiftKey, e.code)
				if (e.ctrlKey && e.shiftKey) {
					switch (e.code) {
						case 'Digit0':
							e.preventDefault();
							return insertIntro();
						case 'Digit1':
							e.preventDefault();
							return insertPrimaryTopic();
						case 'Digit2':
							e.preventDefault();
							return insertSecondaryTopic();
						case 'Digit3':
							e.preventDefault();
							return insertContinuedtopic();
						case 'Digit4':
							e.preventDefault();
							return insertSponsorHeader();
					}
				}
			};
			let epReq = await getVideos({
				filters: {
					order: { id: 'release-desc', label: 'Stream Date (Descending)' },
					hideCW: false,
					hideCorrupt: false,
					startDate: '2012-08-27T23:00:00.000Z',
					endDate: new Date().toISOString(),
					members: []
				},
				offset: 0,
				limit: 1,
				flags: { include: ['cast_ids', 'topic_count'] }
			});
			if (epReq.ok) {
				let episodes = await epReq.json();
				$vod = episodes[0];
			}
		}

		editorContent.subscribe(() => {
			$topics = processTimestampDocument($editorContent);
			window.localStorage.setItem('wdb.ec', $editorContent);
		});
	});

	function newLineify(): [string[], number, number, number] {
		let text = $editor.value;
		let cursorPos = $editor.selectionEnd;
		let lines = text.split('\n');
		let currentPos = 0;
		let lineNo = 0;
		for (let ln of lines) {
			lineNo++;
			for (let _ of ln) {
				currentPos++;
			}
			if (currentPos === cursorPos) break;
			currentPos++;
		}
		return [lines, lineNo, cursorPos, text.length];
	}

	function cursorDifferential(beforePosition: number, original: number, current: number): number {
		let difference = current - original;
		let plannedPosition = beforePosition + difference;
		return plannedPosition;
	}

	function insertIntro() {
		let [lines, current] = newLineify();
		lines.splice(current, 0, `[${toHumanTime($currentTime)}] *Intro*`);
		$editor.value = lines.join('\n');
	}

	function insertPrimaryTopic() {
		let [lines, current, cursor, original] = newLineify();
		lines.splice(current, 0, `[${toHumanTime($currentTime)}] *Topic #${$topics.length + 1}: *`);
		$editor.value = lines.join('\n');
		$editor.focus();
		$editor.selectionEnd = cursorDifferential(cursor, original, $editor.value.length) - 1;
	}

	function insertSecondaryTopic() {
		let [lines, current, cursor, original] = newLineify();
		lines.splice(current, 0, `  > ${toHumanTime($currentTime)} `);
		$editor.value = lines.join('\n');
		$editor.focus();
		$editor.selectionEnd = cursorDifferential(cursor, original, $editor.value.length)+1;
	}

	function insertContinuedtopic() {
		let [lines, current, cursor, original] = newLineify();
		lines.splice(current, 0, `[Cont.] *Topic #: *`);
		$editor.value = lines.join('\n');
		$editor.focus();
		$editor.selectionEnd = cursorDifferential(cursor, original, $editor.value.length) - 3;
	}

	function insertSponsorHeader() {
		let [lines, current, cursor, original] = newLineify();
		lines.splice(current, 0, `[${toHumanTime($currentTime)}] *Sponsor Spots*`);
		$editor.value = lines.join('\n');
		$editor.focus();
		$editor.selectionEnd = cursorDifferential(cursor, original, $editor.value.length) - 1;
		insertSecondaryTopic();
	}

	const liveHTML = writable('');

	liveState.subscribe((v) => {
		if (!v) return;
		$liveHTML = v.live
			? '<span style="color: red;">Live</span>'
			: '<span style="color: grey;">Offline</span>';
	});
</script>

<head>
	<script src="https://www.youtube.com/iframe_api"></script>
</head>

<div class="container">
	<div class="editor">
		<div class="toolbar">
			<h1>
				Topic Editor
				<sup style="font-size: small;color: red;text-decoration: underline;">preview</sup>
			</h1>
			<div>
				{#if $liveState !== null && $liveState !== undefined}
					<p>{$liveState.title}</p>
					<div style="display: flex;justify-content:space-evenly">
						<span>{$liveState.isWAN ? 'WAN' : 'Not WAN'}</span>
						<span>|</span>
						<span bind:innerHTML={$liveHTML} contenteditable="false" />
						<span>|</span>
						<span>{$liveState.textImminence}</span>
					</div>
				{/if}
			</div>
		</div>
		<textarea class="body" bind:this={$editor} bind:value={$editorContent} />
	</div>
	<div class="context">
		<div class="player">
			{#if $vod !== undefined}
				<Player bind:vod={$vod} />
			{/if}
		</div>
		<div class="topics">
			<div class="topic-list">
				<h2>Generated Topics</h2>
				{#if $topics.length > 0}
					{#each $topics as topic, index}
						<Topic {topic} dev={true} />
						{#if index < $topics.length - 1}
							<hr />
						{/if}
					{:else}
						<p>Start typing to generate topics</p>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		margin: 0 5px;
		display: grid;
		grid-template-columns: auto 5px 600px;
		grid-template-areas: 'editor . context';
		max-height: calc(100vh - 15px) !important;
		overflow: hidden;
	}

	.editor {
		padding-top: 75px;
		padding-bottom: 15px;
		width: auto;
		display: flex;
		flex-direction: column;
		grid-area: editor;
		border-radius: 5px;
		/* background-color: rgb(var(--bg-secondary)); */
		color: rgb(var(--textPrimary));
	}

	.editor .toolbar {
		width: auto;
		display: flex;
		flex-grow: 0;
		margin: 5px;
		flex-direction: row;
		justify-content: space-between;
	}

	.editor .body {
		flex-grow: 1;
		/* min-height: inherit; */
		width: 100%;
		font-size: larger;
		padding: 5px;
		font-style: normal;
		border-radius: 5px;
		overflow-x: hidden;
		overflow-y: scroll;
		resize: none;
		background-color: rgb(var(--bg-primary));
		color: rgb(var(--textPrimary));
	}

	.context {
		grid-area: context;
		padding-top: 80px;
		padding-bottom: 15px;
		width: auto;
		display: flex;
		flex-direction: column;
		border-radius: 5px;
		/* background-color: rgb(var(--bg-secondary)); */
		color: rgb(var(--textPrimary));
	}

	.topics {
		flex-grow: 1;
		margin: 5px 5px 0 0;
		padding: 5px 5px 0;
		border-radius: 5px;
		background-color: rgb(var(--bg-primary));
		display: flex;
		align-items: center;
		flex-direction: column;
		overflow-y: scroll;
		overflow-x: hidden;
		height: calc(100vh - 440px);
	}

	.topics hr {
		width: 90%;
		margin: 0px auto;
	}

	.player {
		flex-grow: 0;
	}
</style>
