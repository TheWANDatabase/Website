<script>


    import posthog from "posthog-js";
    import {writable} from "svelte/store";
    import {browser} from "$app/environment";

    let show = writable(false)

    if (browser) {
        if (posthog.getFeatureFlag('experiments-landing-page-alpha')) {
            show.set(true);
        } else {
            window.location.pathname = '/archive'
        }
    }

</script>
{#if $show}
    <div class="container">
        <h1>Welcome to SvelteKit</h1>
        <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
    </div>
{/if}
<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        width: 100%;
        height: 100%;
    }
</style>