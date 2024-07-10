import { Component, For } from 'solid-js'
import { TManga } from '@/types'
import { MangaMeta } from '@/contexts'
import { A } from '@solidjs/router'
import { RoutePaths } from '@/enums'

interface ChapterListProps {
  manga: TManga | undefined
  mangaMeta: MangaMeta
}

const ChapterList: Component<ChapterListProps> = props => {
  return (
    <div class="flex flex-col gap-3 flex-wrap">
      <span></span>
      <For each={props.manga?.manga.chapters.nodes}>
        {chapter => (
          <A
            href={`${RoutePaths.manga}/${props.manga?.manga.id}${RoutePaths.chapter}/${chapter.id}`}
          >
            {chapter.name}
          </A>
        )}
      </For>
    </div>
  )
}

export default ChapterList
