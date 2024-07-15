import { Component, For, createMemo } from 'solid-js'
import { A } from '@solidjs/router'
import { MangaMeta } from '@/contexts'
import { ChapterSort, RoutePaths } from '@/enums'
import { TManga } from '@/types'
import { filterChapters, sortChapters } from '@/helpers'

interface ChapterListProps {
  manga: TManga | undefined
  mangaMeta: MangaMeta
}

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
            <A
              href={`${RoutePaths.manga}/${props.manga?.manga.id}${RoutePaths.chapter}/${chapter.id}`}
              class="flex justify-between transition-all p-1"
              classList={{
                'opacity-50 hover:opacity-80': chapter.isRead,
                'opacity-100 hover:opacity-80': !chapter.isRead,
              }}
            >
              <div class="flex flex-col">
                <span>{chapter.name}</span>
                <span>{chapter.scanlator}</span>
                <span>#{chapter.sourceOrder}</span>
              </div>
              <div>
                <span>{new Date(+chapter.uploadDate).toLocaleDateString()}</span>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  )
}

export default ChapterList
