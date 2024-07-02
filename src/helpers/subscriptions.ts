import { ResultOf, client } from '@/gql'
import { downloadsOnChapters, updateStatusSubscription } from '@/gql/Subscriptions'
import { createSignal, onCleanup } from 'solid-js'

export const useUpdaterSubscription = () => {
  const [updaterStatus, setUpdaterStatus] =
    createSignal<ResultOf<typeof updateStatusSubscription>>()

  const sub = client
    .subscription(updateStatusSubscription, {}, { requestPolicy: 'network-only' })
    .subscribe(res => setUpdaterStatus(res.data))

  onCleanup(() => sub.unsubscribe())

  return updaterStatus
}

export const useDownloadSubscription = () => {
  const [downloadStatus, setDownloadStatus] = createSignal<ResultOf<typeof downloadsOnChapters>>()

  const sub = client
    .subscription(downloadsOnChapters, {}, { requestPolicy: 'cache-and-network' })
    .subscribe(res => setDownloadStatus(res.data))

  onCleanup(() => sub.unsubscribe())

  return downloadStatus
}
