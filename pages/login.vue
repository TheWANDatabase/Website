<script setup lang="ts">
const supabase = useSupabaseClient()

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      //     queryParams: {
      //         access_type: 'offline',
      //         prompt: 'consent',
      //     },
      redirectTo: window.location.hostname === 'localhost' ? 'http://localhost:3000' : `https://${window.location.hostname}`
    }
  })
  if (error) { alert(error) }
}

const signInWithDiscord = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.hostname === 'localhost' ? 'http://localhost:3000' : `https://${window.location.hostname}`
    }
  })
  if (error) { alert(error) }
}
</script>
<template>
  <div class="container">
    <h2>Log In or Sign Up</h2>
    <p>What benefits come from having an account?</p>
    <ul>
      <li>
        <strong>Watch History</strong>
        <p>
          We will monitor and store youre playback position when you view episodes
          through our viewer
        </p>
      </li>
      <li>
        <strong>Statistics</strong>
        <p>
          We will allow you to view your watch statistics across every episode, can you
          achieve 100% completion?
        </p>
      </li>
      <li>
        <strong>Community Contributions</strong>
        <p>
          We are working very hard on bringing the ability for the
          community to contribute to this database, to ensure that it is 100% accurate.
        </p>
      </li>
      <li>
        <strong>Additional Features</strong>
        <p>
          We are always adding new features to this project, many of which are
          made available to members before anyone else. Join our Beta Program by signing up!
        </p>
      </li>
    </ul>
    <div class="form">
      <h3>Click one of the buttons below to sign up or log in.</h3>
      <div>
        <button @click="signInWithGoogle">
          <Icon name="devicon:google" />
        </button>
        <button @click="signInWithDiscord">
          <Icon name="logos:discord-icon" />
        </button>
      </div>
    </div>
    <h3>Still Not Sure?</h3>
    <p>
      Here's some additional information about how we handle and process your data. Because we like being transparent
      about privacy.
    </p>
    <p>
      <strong>What do we do with your data?</strong><br>
      The answer is incredibly simple, it is stored in a secure server that has been verified to be up to the latest
      European medical data protection standards, and only ever transmitted using securely encrypted
      protocols. We use your data exclusively to ensure that you are given the best
      experience possible. Your data never leaves our servers except to go directly to you, and only you.
      <br>
      We never sell any information, and we never want to! This project was built on good faith and the effort of a
      small contingent of the LTT/LMG community. The last thing we want is to be on The WAN Show for a data breach!
      <br>
      <br>
      <strong>What information do we store?</strong><br>

      When you sign up for an account, we receive your email address, avatar, and your name from the social provider.
      If you sign up using Google, this will be the name associated with your Google account, for Discord, it will be
      the name used for your friends to add you.

      We allow you to modify both your name, and your display name individually within our profile settings, so if you
      do not wish for us to know your name, that is where you can change it. By default, only your display name is
      shown publicly, if one is not set, you will show up as "Anonymous User" to other users. Your name will never be
      visible to anyone but you.

      We do strongly encourage you to make your first task as a new user to be setting a new name for us to identify
      you by.
    </p>
    <br>
    <h4>
      And if all that still leaves you unsure, you can view the legalese of our <NuxtLink style="color: #fff" href="/privacy">
        Privacy Policy
      </NuxtLink>
    </h4>
  </div>
</template>
<style scoped>
.container {
    width: fit-content;
    height: fit-content;
    margin: auto;
    color: white;
}

.container button svg {
    width: 50px;
    height: 50px;
    margin: auto;
}

.container button {
    width: 65px;
    height: 65px;
    border-radius: 10px;
    border: none;
    margin: 0.5rem;
    background-color: #2a2a2a
}

.container ul li {
    margin: 0.5rem 0.5rem 1rem;
}

.container ul li p {
    max-width: 700px;
    margin: 0;
}

.container p {
    max-width: 800px;
    justify-content: left;
    text-align: justify;
    word-wrap: normal;
    padding: 0.5rem;
}

.form {
    margin: 0.5rem auto;
    width: fit-content;
}

.form h3 {
    width: fit-content;
    margin: auto;
    text-align: center;
}

.form div {
    width: fit-content;
    margin: auto;
    text-align: center;
}
</style>
