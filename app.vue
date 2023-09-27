<template>
  <div :class="`bg-${cfg ? cfg.theme.greyscale : 'zinc'}-900 text-${cfg ? cfg.theme.greyscale : 'zinc'}-200`">
    <Header />
    <a name="top" />
    <NuxtPage />
    <a name="bottom" />
    <Footer />
    <UNotifications />
  </div>
</template>

<script setup>
import { rejects } from 'assert'
import { client as StompClient } from 'webstomp-client'
import { getToken, onMessage } from 'firebase/messaging'

const messaging = useFirebaseMessaging()
const cfg = useState('uconf')
const stomp = useState('stomp', () => null)
const toast = useToast()
const config = useRuntimeConfig()
console.log(config)
// const permission = useState('notification', () => null)

function requestPermission() {
  return new Promise((resolve) => {
    console.debug('Requesting permission...')
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.debug('Notification permission granted.')
        resolve(permission)
      }
    })
  })
}

onMounted(() => {
  const debug = config.public.debug
  // if (permission.value === null) { permission.value = await requestPermission() }

  onMessage(messaging, (p) => {
    console.debug(p)
    // Notification()
  })
  getToken(messaging, { vapidKey: config.public.vapidKey }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      console.debug('FCM token is valid')
      // ...
    } else {
      // Show permission request UI
      console.debug('No registration token available. Request permission to generate one.')
      requestPermission()
      // ...
    }
  }).catch((err) => {
    console.error('An error occurred while retrieving token. ', err)
    // ...
  })

  if (debug) {
    toast.add({
      title: 'Socket Connecting'
    })
  }
  stomp.value = StompClient('wss://mq.thewandb.com/ws', { debug })
  stomp.value.connect(config.public.ws.user, config.public.ws.password, (e, x) => {
    console.debug('realtime socket connected')
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
          console.debug(body)
          if (body.op === 1000) {
            notificationHandler(
              body.payload,
              toast
            )
          }
        }
        message.ack()
      } catch (e) {
        console.error(e)
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
