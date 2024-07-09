import { Component, JSX, Match, Switch, createMemo, createSignal, splitProps } from 'solid-js'
import FailedIcon from '~icons/material-symbols/broken-image'

interface ImageProps extends JSX.HTMLAttributes<HTMLImageElement> {
  src: string | unknown
  alt?: string
  rounded?: string
  /** Rewrite wrapper classes */
  wrapperClasses?: string
}

const Image: Component<ImageProps> = props => {
  enum ImageState {
    loading = 'loading',
    error = 'error',
    success = 'success',
  }

  const [unique, rest] = splitProps(props, ['class', 'src', 'alt', 'rounded', 'wrapperClasses'])

  let img: HTMLImageElement | undefined

  const rounded = createMemo(() => (unique.rounded ? `rounded-${unique.rounded}` : 'rounded-lg'))

  const wrapperClasses = createMemo(() =>
    unique.wrapperClasses ? unique.wrapperClasses : 'relative h-full w-full'
  )
  const imgClasses = createMemo(() =>
    ['w-full', 'h-full', 'img', ...(unique.class ? [unique.class] : [])].join(' ')
  )

  const [state, setState] = createSignal<ImageState>(ImageState.loading)

  if (typeof unique.src !== 'string' || unique.src === '') error()

  function load() {
    setState(ImageState.success)
  }

  function error() {
    setState(ImageState.error)
  }

  return (
    <div class={wrapperClasses()}>
      <img
        ref={img}
        class={`${rounded()} ${imgClasses()}`}
        onError={error}
        onLoad={load}
        src={unique.src as string}
        alt={unique.alt}
        loading="lazy"
        {...rest}
      />
      <Switch>
        <Match when={state() === ImageState.error}>
          <div
            class={`icon-32 top-0 absolute flex items-center justify-center text-rose-800 ${rounded()} ${imgClasses()}`}
          >
            <FailedIcon />
          </div>
        </Match>
        <Match when={state() === ImageState.loading}>
          <div
            class={`animate-pulse placeholder w-full h-full absolute bottom-0 left-0 right-0 top-0 ${rounded()} bg-neutral-700`}
          />
        </Match>
      </Switch>
    </div>
  )
}

export default Image
