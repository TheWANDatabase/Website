<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser();
const email = ref('')
const password = ref('')

const signInWithOtp = async () => {
    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    })
    if (error) console.log(error)
    window.history.back()
}

const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'// ,
        // options: {
        //     queryParams: {
        //         access_type: 'offline',
        //         prompt: 'consent',
        //     },
        //     redirectTo: '/confirm'
        // }
    })
    if (error) console.log(error)

}

const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord'
    })
    if (error) console.log(error)

}
</script>
<template>
    <div>
        <button @click="signInWithGoogle">
            Sign In with Google
        </button>
        <button @click="signInWithDiscord">
            Sign In with Discord
        </button>
        <!-- 
        <button @click="signInWithOtp">
            Sign In with E-Mail
        </button>
        <input v-model="email" type="email" />
        <input v-model="password" type="password" /> 
        -->
    </div>
</template>