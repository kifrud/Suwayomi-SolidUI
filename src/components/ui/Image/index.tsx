import { useAppContext } from '@/contexts'
import { Component, JSX, Match, Switch, createMemo, createSignal } from 'solid-js'

interface ImageProps extends JSX.HTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  rounded?: string
}

const Image: Component<ImageProps> = props => {
  enum ImageState {
    loading = 'loading',
    error = 'error',
    success = 'success',
  }

  let img: HTMLImageElement | undefined

  const { t } = useAppContext()

  const rounded = createMemo(() => (props.rounded ? `rounded-${props.rounded}` : 'rounded-lg'))

  const imgClasses = createMemo(() =>
    ['w-full', 'h-full', 'img', ...(props.class ? [props.class] : [])].join(' ')
  )

  const [state, setState] = createSignal<ImageState>(ImageState.loading)

  if (typeof props.src !== 'string' || props.src === '') error()

  function load() {
    setState(ImageState.success)
  }

  function error() {
    setState(ImageState.error)
  }

  return (
    <div class="relative h-full w-full">
      <img
        ref={img}
        class={`${imgClasses()} ${rounded()}`}
        onError={error}
        onLoad={load}
        src={props.src}
        alt={props.alt}
        loading="lazy"
      />
      <Switch>
        <Match when={state() === ImageState.error}>
          <div
            class={`top-0 absolute flex items-center justify-center text-rose-800 ${rounded()} ${imgClasses()}`}
          >
            {t('exceptions.library.cover')}
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
