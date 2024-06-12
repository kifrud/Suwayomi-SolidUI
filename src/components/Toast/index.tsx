import { Component, JSX, splitProps } from 'solid-js'
import { ToastRootProps, Toast as ToastUi } from '@kobalte/core/toast'
import type { ToastPayload } from '@/helpers'
import CloseIcon from '~icons/material-symbols/close-rounded'
import './styles.scss'

interface ToastProps extends ToastRootProps {
  payload: ToastPayload | JSX.Element
  state?: 'pending' | 'fulfilled' | 'rejected'
  error?: unknown
  data?: unknown
  class?: string
}

const Toast: Component<ToastProps> = props => {
  const [unique, rest] = splitProps(props, ['data', 'state', 'error', 'payload', 'class'])

  if (unique.payload instanceof Element) {
    return <ToastUi {...rest}>{unique.payload as Element}</ToastUi>
  }

  const payload = () => unique.payload as ToastPayload


  return (
    <ToastUi class={`toast ${unique.class}`} {...rest}>
      <div class="toast__content-wrp">
        <div class="toast__content">
          <div class="toast__icon-wrp">
            {payload().icon}
          </div>
          <div>
            <ToastUi.Title class="toast__title">{payload().title}</ToastUi.Title>
            <ToastUi.Description class="toast__description">
              {payload().message}
            </ToastUi.Description>
          </div>
        </div>
        <ToastUi.CloseButton class="toast__close-button">
          <CloseIcon />
        </ToastUi.CloseButton>
      </div>
      <ToastUi.ProgressTrack class="toast__progress-track">
        <ToastUi.ProgressFill class="toast__progress-fill" />
      </ToastUi.ProgressTrack>
    </ToastUi>
  )
}

export default Toast
