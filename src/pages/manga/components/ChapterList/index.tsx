import { Component, For, Show, createMemo } from 'solid-js'
import { Skeleton } from '@/components'
import { MangaMeta, useAppContext } from '@/contexts'
import { TManga } from '@/types'
import { filterChapters, sortChapters } from '@/helpers'
import { WindowVirtualizer } from 'virtua/solid'
import ChapterListItem from './ChapterListItem'

interface ChapterListProps {
  manga: TManga | undefined
  mangaMeta: MangaMeta
  refetch: () => Promise<void>
}

const ChapterList: Component<ChapterListProps> = props => {
  const { t } = useAppContext()

  const filteredChapters = createMemo(() =>
    props.manga?.manga.chapters.nodes.filter(ch => filterChapters(ch, props.mangaMeta))
  )

  const sortedChapters = createMemo(() =>
    filteredChapters()?.toSorted((a, b) => sortChapters(a, b, props.mangaMeta))
  )

  const placeholder = (
    <For each={new Array(13)}>{() => <Skeleton class="p-2 w-full rounded-lg h-12" />}</For>
  )

  return (
    <div class="flex flex-col gap-3 flex-wrap">
      <span class="font-bold">{props.manga?.manga.chapters.totalCount}</span>
      <div class="flex flex-col gap-2">
        <Show when={sortedChapters()} fallback={placeholder}>
          <Show
            when={sortedChapters()!.length > 0}
            fallback={
              <span class="w-full flex justify-center opacity-50">
                {t('exceptions.manga.noChapters')}
              </span>
            }
          >
            <WindowVirtualizer data={sortedChapters()!}>
              {chapter => (
                <ChapterListItem chapter={chapter} manga={props.manga} refetch={props.refetch} />
              )}
            </WindowVirtualizer>
          </Show>
        </Show>
      </div>
    </div>
  )
}

export default ChapterList
