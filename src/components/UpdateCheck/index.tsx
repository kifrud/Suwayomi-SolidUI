import { Component, Show, createMemo, createResource } from 'solid-js'
import { Progress } from '@kobalte/core/progress'
import { useGraphQLClient } from '@/contexts'
import { useNotification, useUpdaterSubscription } from '@/helpers'
import { ResultOf } from '@/gql'
import { latestUpdateTimestamp } from '@/gql/Queries'
import { updateLibraryMangas } from '@/gql/Mutations'
import { updateStatusSubscription } from '@/gql/Subscriptions'
import { Tooltip } from '@/components'
import UpdateIcon from '~icons/material-symbols/update'
import './styles.scss'

// TODO: notify if found new chapters
const UpdateCheck: Component = () => {
  const client = useGraphQLClient()
  const status = useUpdaterSubscription()

  const [latestTimestampData, { refetch }] = createResource(
    async () =>
      await client
        .query(latestUpdateTimestamp, {}, { requestPolicy: 'cache-and-network' })
        .toPromise()
  )

  const loading = createMemo(() => status()?.updateStatusChanged.isRunning)

  const latestTimestamp = createMemo(() =>
    new Date(+latestTimestampData.latest?.data?.lastUpdateTimestamp.timestamp!).toLocaleString()
  )

  const calcProgress = (status: ResultOf<typeof updateStatusSubscription>) => {
    if (!status.updateStatusChanged) return 0

    const finished =
      status.updateStatusChanged.completeJobs.mangas.totalCount +
      status.updateStatusChanged.failedJobs.mangas.totalCount

    const total =
      finished +
      status.updateStatusChanged.pendingJobs.mangas.totalCount +
      status.updateStatusChanged.runningJobs.mangas.totalCount

    const progress = 100 * (finished / total)

    return Number.isNaN(progress) ? 0 : progress
  }

  const handleClick = async () => {
    try {
      await client.mutation(updateLibraryMangas, {}).toPromise()
      refetch()
    } catch (error) {
      useNotification('error', { message: error as string })
    }
  }

  return (
    <>
      <Tooltip
        openDelay={150}
        closeDelay={100}
        classes={{
          trigger: 'transition-all icon-24 action cursor-pointer',
        }}
        onClick={handleClick}
        disabled={loading()}
        label={<UpdateIcon />}
      >
        <Show when={!latestTimestampData.loading} fallback={'-'}>
          {latestTimestamp()}
        </Show>
      </Tooltip>
      <Show when={loading()}>
        <Progress value={status() ? calcProgress(status()!) : 0} class="update-check__progress">
          <Progress.Track class="update-check__progress-track">
            <Progress.Fill class="update-check__progress-fill" />
          </Progress.Track>
        </Progress>
      </Show>
    </>
  )
}

export default UpdateCheck
