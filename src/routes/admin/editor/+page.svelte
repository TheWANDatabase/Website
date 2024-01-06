<script lang="ts">
	import { getVideos } from '$lib/api';
	import Player from '$lib/components/Player.svelte';
	import Topic from '$lib/components/Topic.svelte';
	import { processTimestampDocument } from '$lib/editor';
	import { currentTime } from '$lib/stores';
	import { toHumanTime } from '$lib/time';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	let vod = writable();
	let topics: Writable<any[]> = writable([]);
	let editor: Writable<HTMLTextAreaElement> = writable();
	let editorContent = writable('-Timestamps-\n[0:00] *Chapters*');

	onMount(async () => {
		if (typeof window !== 'undefined') {
			window.onkeydown = (e) => {
				if (e.ctrlKey) {
					switch (e.key) {
						case 'i':
							e.preventDefault();
							return insertIntro();
						case 'm':
							e.preventDefault();
							return insertPrimaryTopic();
					}
				}
			};
			let epReq = await getVideos();
			if (epReq.ok) {
				let episodes = await epReq.json();
				$vod = episodes[0];
			}
		}

		editorContent.subscribe(() => {
			$topics = processTimestampDocument($editorContent);
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
		console.log(beforePosition, original, current);
		let difference = current - original;
		console.log(difference);
		let plannedPosition = beforePosition + difference;
		console.log(plannedPosition);
		return plannedPosition;
	}

	function insertIntro() {
		let [lines, current, cursor, original] = newLineify();
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
</script>

<div class="container">
	<div class="editor">
		<div class="toolbar">
			<button class=""> </button>
		</div>
		<div class="body">
			<textarea bind:this={$editor} bind:value={$editorContent} />
		</div>
	</div>
	<div class="player">
		{#if $vod !== undefined}
			<Player bind:vod={$vod} />
		{/if}
	</div>
	<div class="topics">
		<div class="topic-list">
			<h2>Generated Topics</h2>
			{#if $topics.length > 0}
				{#each $topics as topic}
					<Topic {topic} />
				{/each}
			{:else}
				<p>Start typing to generate topics</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		margin: 5px 5px 5px;
		display: grid;
		grid-template-columns: auto 300px;
		grid-template-rows: 345px 500px;
		max-height: 1000px;
		grid-template-areas:
			'editor vod'
			'editor topics';
		width: calc(100vw, -10px);
	}

	.editor {
		width: 100%;
		grid-area: editor;
		border-radius: 5px;
		background-color: var(--bg-secondary);
		color: var(--textPrimary);
	}

	.editor .body {
		padding: 5px;
		width: 100%;
		min-height: 700px;
		height: 70%;
		border-radius: 5px;
		color: var(--textPrimary);
	}

	.editor .body textarea {
		width: 80%;
		min-height: 700px;
		height: 100%;
		font-size: larger;
		padding: 5px;
		font-style: normal;
		border-radius: 5px;
		overflow-x: hidden;
		overflow-y: scroll;
		resize: none;
		background-color: var(--bg-primary);
		color: var(--textPrimary);
	}

	.topics {
		grid-area: topics;
		height: auto;
		margin: 5px 0 0 -16vw;
		width: auto;
		border-radius: 5px;
		background-color: var(--bg-primary);
		display: flex;
		align-items: center;
		flex-direction: column;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.player {
		grid-area: vod;
		margin: 0 0 0 -16vw;
		width: auto;
		height: auto;
	}
</style>
