<head>
    <title>Login | The WAN Database</title>
</head>
<script lang="ts">

  import {writable} from "svelte/store";
  import {signIn} from "$lib/api";
  import posthog from "posthog-js";
  import {browser} from "$app/environment";

  let email = writable("");
  let password = writable("");
  let error = writable("");

  let show = writable(false)

  if (browser) {
    show.set(posthog.getFeatureFlag('allow-login') === true);
  }

  async function login(e: Event) {
    e.preventDefault()
    let response = await signIn($email, $password);
    console.log(response);

    if (response.status === 200) {

      // window.location.href = "/";
    } else {
      $error = (await response.json()).error;
    }
  }

</script>
<div class="container">
    {#if $show}
        <h1>Log In</h1>
        <p>
            Please sign in to your account. Don't have one? <a href="/register">Please register</a>.
        </p>
        <form>
            {#if $error !== ""}
                <div class="error">
                    <p>{$error}</p>
                </div>
            {/if}
            <div class="input-group">
                <label for="email">Email</label>
                <input bind:value={$email} id="email" name="email" placeholder="example@example.com" type="email"/>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input bind:value={$password} id="password" name="password" placeholder="Password" type="password"/>
            </div>
            <button on:click={login} type="submit">Log In</button>
        </form>
    {:else}
        <div>
            <div class="error">
                <h1>Logins Disabled</h1>
                <p>Unfortunately logins are disabled at this moment in time.<br/>We do not know when they will be back.
                </p>
            </div>
        </div>
    {/if}

</div>
<style>
    .error {
        background-color: #ff0000;
        color: #ffffff;
        border-radius: 5px;
        padding: 1em;
        margin: 1em 0;
    }

    .container {
        max-width: 50em;
        margin: 0 auto;
        border: 1px solid #777;
        border-radius: 10px;
        padding: 1em;
    }

    form {
        margin-top: 1em;
        display: flex;
        flex-direction: column;
    }

    .input-group {
        display: grid;
        grid-template-columns: 1fr 3fr;
        margin-bottom: 0.5em;
        margin: 0 1em 0.5em;
    }

    label {
        font-weight: bold;
        display: inline;
    }

    input {
        margin-bottom: 1em;
        display: inline;
    }
</style>