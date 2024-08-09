import { Component, Setter, Show } from 'solid-js'
import { ChapterOffset } from '@/helpers'
import { TChapter } from '@/types'
import { useAppContext } from '@/contexts'

interface TransitionScreenProps {
  direction: ChapterOffset | undefined
  chapter: TChapter
  followingChapter: TChapter | undefined
  updateDirection: Setter<ChapterOffset | undefined>
}

const TransitionScreen: Component<TransitionScreenProps> = props => {
  const { t } = useAppContext()

  const handleClick = () => {
    props.updateDirection(undefined)
  }

  return (
    <div
      class="flex flex-col justify-center items-center h-screen w-full gap-2"
      on:click={handleClick}
    >
      <Show when={props.chapter}>
        <h3>
          <b>
            <Show when={props.direction === ChapterOffset.NEXT} fallback={t('chapter.current')}>
              {t('chapter.finished')}
            </Show>
          </b>
        </h3>
        <span>{props.chapter.name}</span>
      </Show>
      <Show when={props.followingChapter} fallback={<span></span>}>
        <h3>
          <b>
            <Show when={props.direction === ChapterOffset.NEXT} fallback={t('chapter.prev')}>
              {t('chapter.next')}
            </Show>
          </b>
        </h3>
        <span>{props.followingChapter!.name}</span>
      </Show>
    </div>
  )
}

export default TransitionScreen
