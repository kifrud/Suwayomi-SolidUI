import { Component, For, createMemo } from 'solid-js'
import { MangaMeta } from '@/contexts'
import { TManga } from '@/types'
import { filterChapters, sortChapters } from '@/helpers'
import ChapterListItem from './ChapterListItem'

interface ChapterListProps {
  manga: TManga | undefined
  mangaMeta: MangaMeta
  refetch: () => Promise<void>
}
// TODO: virtualize & add placeholder
const ChapterList: Component<ChapterListProps> = props => {
  const filteredChapters = createMemo(() =>
    props.manga?.manga.chapters.nodes.filter(ch => filterChapters(ch, props.mangaMeta))
  )

  const sortedChapters = createMemo(() =>
    filteredChapters()?.toSorted((a, b) => sortChapters(a, b, props.mangaMeta))
  )

  return (
    <div class="flex flex-col gap-3 flex-wrap">
      <span class="font-bold">{props.manga?.manga.chapters.totalCount}</span>
      <div class="flex flex-col gap-2">
        <For each={sortedChapters()}>
          {chapter => (
            <ChapterListItem chapter={chapter} manga={props.manga} refetch={props.refetch} />
          )}
        </For>
      </div>
    </div>
  )
}

export default ChapterList
