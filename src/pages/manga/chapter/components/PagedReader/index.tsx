import { Component, type JSX } from 'solid-js'
import { Image } from '@/components'
import { Mode } from '@/enums'
import { ReaderProps } from '@/types'

const PagedReader: Component<ReaderProps> = props => {
  const nextPage = () => {
    if (props.currentPage() < props.chapter.pageCount - 1) {
      props.updateCurrentPage(prev => prev + 1)
    } else {
      props.nextChapter()
    }
  }

  const prevPage = () => {
    if (props.currentPage() > 0) {
      props.updateCurrentPage(prev => prev - 1)
    } else {
      props.prevChapter()
    }
  }

  const goLeft = () => {
    if (props.settings.ReaderMode === Mode.SingleLTR) {
      prevPage()
    } else if (props.settings.ReaderMode === Mode.SingleRTL) {
      nextPage()
    }
  }

  const goRight = () => {
    if (props.settings.ReaderMode === Mode.SingleLTR) {
      nextPage()
    } else if (props.settings.ReaderMode === Mode.SingleRTL) {
      prevPage()
    }
  }

  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = e => {
    if (e.clientX > window.innerWidth / 2) {
      goRight()
    } else {
      goLeft()
    }
  }

  return (
    <div on:click={handleClick}>
      <Image src={props.pages[props.currentPage()]} alt=" " rounded="none" />
    </div>
  )
}

export default PagedReader
