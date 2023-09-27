import { Messaging, getMessaging } from 'firebase/messaging/sw'
import { useFirebaseApp } from 'vuefire'

export function useFirebaseMessaging(): Messaging {
  return getMessaging(useFirebaseApp())
}
