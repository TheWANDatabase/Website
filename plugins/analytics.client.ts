import {
  type Analytics,
  initializeAnalytics,
  isSupported
} from 'firebase/analytics'

export default defineNuxtPlugin(async () => {
  const firebaseApp = useFirebaseApp()

  console.debug('Loading analytics')

  let analytics: Analytics | null = null
  if (await isSupported()) {
    analytics = initializeAnalytics(firebaseApp)
    console.debug('Loaded analytics')
  } else {
    console.debug('Analytics not supported')
  }

  return {
    provide: {
      analytics
    }
  }
})
