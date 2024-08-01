import { Component, Show, createMemo } from 'solid-js'
import { Button } from '../ui'
import ContinueIcon from '~icons/material-symbols/play-arrow'
import { useAppContext } from '@/contexts'
import { A } from '@solidjs/router'

interface ReadButtonProps {
  hideLabel?: boolean
  isRead: boolean | undefined
  class?: string
  href: string
}

const ReadButton: Component<ReadButtonProps> = props => {
  const { t } = useAppContext()

  const btnClasses = createMemo(() =>
    [
      'absolute',
      'bottom-2',
      'right-2',
      'z-20',
      'flex',
      'items-center',
      'justify-center',
      'pl-1',
      'pr-2',
      'py-2',
      'text-sm',
      'bg-foreground',
      'text-background',
      'rounded-lg',
      ...(props.class ? [props.class] : []),
    ].join(' ')
  )

  return (
    <Show when={!props.isRead}>
      <A href={props.href} class={btnClasses()}>
        <ContinueIcon color="currentColor" class="text-background" />
        <Show when={!props.hideLabel && !props.isRead}>
          <Show when={props.isRead === false} fallback={t('global.button.continue')}>
            {t('global.button.read')}
          </Show>
        </Show>
      </A>
    </Show>
  )
}

export default ReadButton
