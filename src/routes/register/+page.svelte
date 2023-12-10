<head>
    <title>Login | The WAN Database</title>
</head>
<script lang="ts">

  import {writable} from "svelte/store";
  import {signUp} from "$lib/api";
  import Markdown from "markdown-it";
  import posthog from "posthog-js";
  import {browser} from "$app/environment";

  let show = writable(false)

  if (browser) {
    show.set(posthog.getFeatureFlag('allow-signup') === true);
  }
  const md = new Markdown({
    html: true,
    linkify: true,
    typographer: true
  });

  let email = writable("");
  let username = writable("");
  let password = writable("");
  let error = writable("");
  let tosAgree = writable(false);
  let privacyAgree = writable(false);
  let modalShow = writable(false);
  let modalContent = writable("");


  async function signup(e: Event) {
    e.preventDefault()
    let response = await signUp($username, $email, $password);
    console.log(response);

    if (response.status === 200) {

      // window.location.href = "/";
    } else {
      $error = (await response.json()).error;
    }
  }

  async function tos(e: Event) {
    e.preventDefault()
    $modalContent = md.render(await (await fetch("/tos.md")).text());
    $modalShow = true;
  }

  async function privacy(e: Event) {
    e.preventDefault()
    $modalContent = md.render(await (await fetch("/privacy.md")).text());
    $modalShow = true;
  }

</script>
<div class="container">
    {#if $show}
        <h1>Sign Up</h1>
        <p>
            Already have an account? <a href="/login">Log in</a>
        </p>
        <p>
            We will never share your email with anyone else. We will only use it to send you a confirmation email, or to
            reset
            your password, we may also use it to send you notifications, as well as other emails that you may opt into
            from
            your
            account settings.
        </p>
        <form>
            {#if $error !== ""}
                <div class="error">
                    <p>{$error}</p>
                </div>
            {/if}
            <div class="modal"
                 style={$modalShow ? "background-color: rgba(0, 0, 0, .5); width: 100%; height: 100%;" : "background-color: rgba(0, 0, 0, 0); width: 0; height: 100%;margin: 50%;"}>
                <div class="modal-content">
                    <span bind:innerHTML={$modalContent} contenteditable="false"></span>
                    <button on:click={() => $modalShow = false}>Close</button>
                </div>
            </div>
            <div class="input-group">
                <label for="username">Username</label>
                <input bind:value={$username} id="username" name="username" placeholder="InkyGray1923"/>
            </div>
            <div class="input-group">
                <label for="email">Email</label>
                <input bind:value={$email} id="email" name="email" placeholder="example@example.com" type="email"/>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input bind:value={$password} id="password" name="password" placeholder="Password" type="password"/>
            </div>
            <div class="input-group">
                <label for="tosAgree" style="display: flex">I agree to the
                    <button on:click={tos} style="display: inline;">Terms of Service</button>
                </label>
                <input bind:checked={$tosAgree} id="tosAgree" name="tosAgree" type="checkbox"/>
            </div>
            <div class="input-group">
                <label for="privacyAgree" style="display: flex">I agree to the
                    <button on:click={privacy} style="display: inline;">Privacy Policy</button>
                </label>
                <input bind:checked={$privacyAgree} id="privacyAgree" name="privacyAgree" type="checkbox"/>
            </div>
            <button on:click={signup} type="submit">Log In</button>
        </form>
    {:else}
        <div>
            <div class="error">
                <h1>Sign Ups Disabled</h1>
                <p>
                    Unfortunately sign ups are disabled at this moment in time.<br/>We do not know when they will be
                    back.
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
        grid-template-columns: 2fr 3fr;
        margin: 0 1em 0.5em;
    }

    label {
        font-weight: bold;
        display: inline;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 0 1em 0.5em;
    }

    label button {
        margin-left: 0.5em;
        padding: 2px 5px;
    }

    input {
        border-radius: 5px;
        border: 1px solid #777;
        padding: 5px 10px;
        background-color: #fff;
        font-size: 0.9em;
        margin-bottom: 1em;
        display: inline;
        width: 100%;
        margin: 0 auto 0.5em 1em;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.5s ease;
    }

    .modal-content {
        background-color: #fff;
        padding: 1em 1em 1em 2em;
        border-radius: 10px;
        width: 50%;
        height: 50%;
        overflow-y: scroll;
    }
</style>