import { ResultOf, client } from '@/gql'
import { updateStatusSubscription } from '@/gql/Subscriptions'
import { createSignal } from 'solid-js'

export const useUpdaterSubscription = () => {
  const [updaterStatus, setUpdaterStatus] =
    createSignal<ResultOf<typeof updateStatusSubscription>>()

  client
    .subscription(updateStatusSubscription, {}, { requestPolicy: 'network-only' })
    .subscribe(res => setUpdaterStatus(res.data))

  return updaterStatus
}
// TODO
// export const useDownloadSubscription = () => {
// }