import { Component, JSX, Show, createEffect, createMemo, splitProps, untrack } from 'solid-js'
import { ToastRootProps, Toast as ToastUi } from '@kobalte/core/toast'
import type { ToastPayload } from '@/helpers'
import { Dictionary, useAppContext } from '@/contexts'
import CloseIcon from '~icons/material-symbols/close-rounded'
import './styles.scss'

interface ToastProps extends ToastRootProps {
  translate?: boolean
  payload: ToastPayload | JSX.Element
  state?: 'pending' | 'fulfilled' | 'rejected'
  error?: unknown
  data?: unknown
  class?: string
}

const Toast: Component<ToastProps> = props => {
  const { t } = useAppContext()
  const [unique, rest] = splitProps(props, [
    'data',
    'state',
    'error',
    'payload',
    'class',
    'translate',
  ])

  if (unique.payload instanceof Element) {
    return <ToastUi {...rest}>{unique.payload as Element}</ToastUi>
  }

  const payload = () => unique.payload as ToastPayload

  const Icon = payload().icon

  const title = createMemo(() =>
    unique.translate ? (t(payload().title as keyof Dictionary) as JSX.Element) : payload().title
  )

  const msg = createMemo(() =>
    unique.translate ? (t(payload().message as keyof Dictionary) as JSX.Element) : payload().message
  )

  return (
    <ToastUi class={`toast ${unique.class}`} {...rest}>
      <div class="toast__body">
        {Icon && (
          <div class="toast__icon-wrp icon-24">
            <Icon />
          </div>
        )}
        <div class="toast__content">
          <ToastUi.Title class="toast__title">{title()}</ToastUi.Title>
          <ToastUi.Description class="toast__description">{msg()}</ToastUi.Description>
        </div>
      </div>
      <ToastUi.CloseButton class="toast__close-button">
        <CloseIcon />
      </ToastUi.CloseButton>
      <ToastUi.ProgressTrack class="toast__progress-track">
        <ToastUi.ProgressFill class="toast__progress-fill" />
      </ToastUi.ProgressTrack>
    </ToastUi>
  )
}

export default Toast
