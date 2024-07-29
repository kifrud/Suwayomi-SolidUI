import { Accessor, Component, For, Setter, Show, createMemo } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WindowVirtualizer } from 'virtua/solid'
import { Skeleton } from '@/components'
import { MangaMeta, useAppContext } from '@/contexts'
import { filterChapters, sortChapters, useDownloadSubscription } from '@/helpers'
import { TChapter, TManga } from '@/types'
import ChapterListItem from './ChapterListItem'

interface ChapterListProps {
  manga: TManga | undefined
  mangaMeta: MangaMeta
  refetch: () => Promise<void>
  selectMode: Accessor<boolean>
  updateSelectMode: Setter<boolean>
  selected: TChapter[]
  updateSelected: SetStoreFunction<TChapter[]>
}

const ChapterList: Component<ChapterListProps> = props => {
  const { t } = useAppContext()

  const downloadStatus = useDownloadSubscription()

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
                <ChapterListItem
                  chapter={chapter}
                  manga={props.manga}
                  chapters={sortedChapters()}
                  selectMode={props.selectMode}
                  updateSelectMode={props.updateSelectMode}
                  selected={props.selected}
                  updateSelected={props.updateSelected}
                  download={downloadStatus()?.downloadChanged.queue.find(
                    q =>
                      chapter.sourceOrder === q.chapter.sourceOrder && chapter.id === q.chapter.id
                  )}
                  refetch={props.refetch}
                />
              )}
            </WindowVirtualizer>
          </Show>
        </Show>
      </div>
    </div>
  )
}

export default ChapterList
