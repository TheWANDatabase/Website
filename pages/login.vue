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
</script>
<template>
    <div>
        <button @click="signInWithOtp">
            Sign In with E-Mail
        </button>
        <input v-model="email" type="email" />
        <input v-model="password" type="password" />
    </div>
</template>