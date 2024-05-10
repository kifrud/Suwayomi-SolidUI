import { Component, Show, createEffect, createMemo, createResource, createSignal } from 'solid-js'
import { Progress } from '@kobalte/core/progress'
import { Tooltip } from '@kobalte/core/tooltip'
import { useGraphQLClient } from '@/contexts'
import { latestUpdateTimestamp, updateStatus as updateStatusQuery } from '@/gql/Queries'
import { updateLibraryMangas } from '@/gql/Mutations'
import UpdateIcon from '~icons/material-symbols/update'
import { client } from '@/gql'
import { updateStatusSubscription } from '@/gql/Subscriptions'

const UpdateCheck: Component = () => {
  const client = useGraphQLClient()
  // TODO: display loading
  const [running, setRunning] = createSignal(false)

  const [latestTimestampData, { refetch }] = createResource(
    async () =>
      await client
        .query(latestUpdateTimestamp, {}, { requestPolicy: 'cache-and-network' })
        .toPromise()
  )

  client
    .subscription(updateStatusSubscription, {}, { requestPolicy: 'network-only' })
    .subscribe(res => setRunning(res.data?.updateStatusChanged.isRunning ?? false))

  const latestTimestamp = createMemo(() =>
    new Date(+latestTimestampData.latest?.data?.lastUpdateTimestamp.timestamp!).toLocaleString()
  )

  // const calcProgress = (status: typeof updateStatus) => {
  //   if (!status.latest?.data?.updateStatus) return 0

  //   const finished =
  //     status.latest.data.updateStatus.completeJobs.mangas.totalCount +
  //     status.latest.data.updateStatus.failedJobs.mangas.totalCount

  //   const total =
  //     finished +
  //     status.latest.data.updateStatus.pendingJobs.mangas.totalCount +
  //     status.latest.data.updateStatus.runningJobs.mangas.totalCount

  //   const progress = 100 * (finished / total)

  //   return Number.isNaN(progress) ? 0 : progress
  // }

  const handleClick = async () => {
    try {
      await client.mutation(updateLibraryMangas, {}).toPromise()
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Tooltip openDelay={150} closeDelay={100}>
        <Tooltip.Trigger
          class="update-check__trigger transition-all icon-32 library-action cursor-pointer"
          onClick={handleClick}
          // disabled={loading()}
        >
          <UpdateIcon />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="update-check__content">
            <span class="icon-32 text-background">
              <Show when={!latestTimestampData.loading} fallback={'-'}>
                {latestTimestamp()}
              </Show>
            </span>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
      {/* <Show when={loading()}>
        <Progress value={calcProgress(updateStatus)} class="update-check__progress">
          <Progress.Track class="update-check__progress-track">
            <Progress.Fill class="update-check__progress-fill" />
          </Progress.Track>
        </Progress>
      </Show> */}
    </>
  )
}

export default UpdateCheck
