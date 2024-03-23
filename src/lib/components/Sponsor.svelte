<script lang="ts">
	import Image from '$lib/components/Image.svelte';

	export let sponsor: any;
</script>

{#if sponsor}
  <a href={sponsor.url} class="sponsor-link" target="_blank">
	  <div class="sponsor-square">
	  	<div class="horizontal-container">
	  		<div class="avatar-container">
	  			<Image id={sponsor.company.logo} width="100px" height="100px" design="round" />
	  		</div>
	  		<div class="vertical-container">
	  			<p class="big-text">
            {sponsor.company.name}
          </p>
	  			<div class="horizontal-container">
            <p class="small-text">{sponsor.message}</p>
	  			</div>
        </div>
	  	</div>
    </div>
  </a>
{/if}

<style>
  .sponsor-link {
    text-decoration: none;
    color: inherit;
    width: auto;
    margin: 0 0.5rem 0.5rem;
  }

	.sponsor-square {
		display: flex;
		flex-direction: column;
		width: inherit;
    margin: 5px 0;
		height: auto;
		border: 1px solid black;
		border-radius: 5px;
	}

	.horizontal-container {
		display: flex;
	}

	.avatar-container {
		padding: 0.5rem;
		/*border: 1px solid;*/
	}

	.big-text {
		margin: 0.5rem 0;
		font-size: large;
		font-weight: 700;
	}
</style>
