<template>
  <div :class="`bg-${cfg ? cfg.theme.greyscale : 'zinc'}-900 text-${cfg ? cfg.theme.greyscale : 'zinc'}-200`">
    <Header />
    <NuxtPage />
    <Footer />
    <UNotifications />
  </div>
</template>

<script setup>
import { client as StompClient } from 'webstomp-client'
const cfg = useState('uconf')
const stomp = useState('stomp', () => null)
const debug = true
const toast = useToast()

onMounted(() => {
  if (debug) {
    toast.add({
      title: 'Socket Connecting'
    })
  }
  stomp.value = StompClient('wss://mq.thewandb.com/ws')
  stomp.value.connect('ui', '72MaU*6x2^p5u&T#', (e, x) => {
    if (debug) {
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: 'Socket Connected',
        description: 'Please hold whilst we configure your queues'
      })
    }

    stomp.value.subscribe('/exchange/ui.notifications', (message) => {
      // process the message
      // acknowledge it
      try {
        const body = JSON.parse(message.body)
        let forME = false

        switch (message.headers.env) {
          case 'dev':
            forME = window.location.origin === 'http://localhost:3000'
            break
          case 'proto':
            forME = window.location.origin === 'https://proto.thewandb.com'
            break
          case 'beta':
            forME = window.location.origin === 'https://beta.thewandb.com'
            break
          case 'prod':
            forME = window.location.origin === 'https://thewandb.com'
            break
          case 'broadcast':
            forME = true
            break
          default:
            forME = false
            break
        }

        console.log(forME, message.headers.env)

        if (forME) {
          toast.add(body)
        }
        message.ack()
      } catch (e) {
        console.log(e)
        message.nack()
      }
    }, { ack: 'client', env: 'dev' })
  })
})
onUnmounted(() => {
  if (stomp.value) { stomp.value.disconnect() }
})

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

* {
  font-family: 'Open Sans', sans-serif;
}

body {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: #18181b;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #18181b;
  }
}
</style>
