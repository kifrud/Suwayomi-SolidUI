import { ChapterOffset } from '@/helpers'
import { TChapter } from '@/types'
import { Component, Setter, Show } from 'solid-js'

interface TransitionScreenProps {
  chapter: TChapter
  followingChapter: TChapter | undefined
  updateDirection: Setter<ChapterOffset | undefined>
}

const TransitionScreen: Component<TransitionScreenProps> = props => {
  const handleClick = () => {
    props.updateDirection(undefined)
  }

  return (
    <div
      class="flex flex-col justify-center items-center h-screen w-full gap-2"
      on:click={handleClick}
    >
      <div>
        <span>{props.chapter.name}</span>
      </div>
      <Show when={props.followingChapter} fallback={<span></span>}>
        <div>{props.followingChapter!.name}</div>
      </Show>
    </div>
  )
}

export default TransitionScreen
