import { Accessor, Component, For, Setter, Show, onMount } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WindowVirtualizer } from 'virtua/solid'
import { Skeleton } from '@/components'
import { MangaMeta, useAppContext } from '@/contexts'
import { useDownloadSubscription } from '@/helpers'
import { TChapter } from '@/types'
import ChapterListItem from './ChapterListItem'

interface ChapterListProps {
  chapters: TChapter[] | undefined
  totalCount: number | undefined
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

  const placeholder = (
    <For each={new Array(13)}>{() => <Skeleton class="p-2 w-full rounded-lg h-12" />}</For>
  )

  return (
    <div class="flex flex-col gap-3 flex-wrap">
      <span class="font-bold">{props.totalCount}</span>
      <div class="flex flex-col gap-2">
        <Show when={props.chapters} fallback={placeholder}>
          <Show
            when={props.chapters!.length > 0}
            fallback={
              <span class="w-full flex justify-center opacity-50">
                {t('exceptions.manga.noChapters')}
              </span>
            }
          >
            <div class="vlist">
              <WindowVirtualizer data={props.chapters!}>
                {chapter => (
                  <ChapterListItem
                    chapter={chapter}
                    chapters={props.chapters}
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
            </div>
          </Show>
        </Show>
      </div>
    </div>
  )
}

export default ChapterList
