import { toaster } from '@kobalte/core/toast'
import { Toast } from '@/components'
import { Component, JSX, createMemo } from 'solid-js'
import SuccessIcon from '~icons/material-symbols/check-circle-outline'
import ErrorIcon from '~icons/material-symbols/error-outline'
import InfoIcon from '~icons/material-symbols/info-outline'
import WarningIcon from '~icons/material-symbols/warning-outline'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface BaseToastPayload {
  message: string
}

export type ToastPayload = BaseToastPayload &
  Partial<{
    title: string
    icon: Component<JSX.HTMLAttributes<HTMLOrSVGElement>>
  }>

const defaultTitles: Record<ToastType, string> = {
  success: 'global.notification.title.success',
  error: 'global.notification.title.error',
  info: 'global.notification.title.info',
  warning: 'global.notification.title.warning',
}

const defaultMessages: Record<ToastType, string> = {
  success: 'global.notification.message.success',
  error: 'global.notification.message.error',
  info: 'global.notification.message.info',
  warning: 'global.notification.message.warning',
}

const defaultIcons: Record<ToastType, Component> = {
  success: SuccessIcon,
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon,
}

const generateContent = (type: ToastType, payload?: ToastPayload | JSX.Element) => {
  if (payload && (typeof payload !== 'object' || !('message' in payload!))) {
    return payload as JSX.Element
  } else {
    const msgPayload = payload as ToastPayload | undefined

    const title = msgPayload?.title ?? defaultTitles[type]
    const message = msgPayload?.message ?? defaultMessages[type]
    const icon = msgPayload?.icon ?? defaultIcons[type]

    return {
      title,
      message,
      icon,
    } satisfies ToastPayload
  }
}

/**
 * Function to call notification toasts
 *
 * @param type Type of the toast (default: `'info'`)
 * @param payload Toast content
 * @param promise If toast should handle promise
 * @param translate If toast should translate `message` and `title` fields in `payload` arg (default: `true`)
 * @returns Toast's `id`
 */
export function useNotification<T extends unknown>(
  type: ToastType = 'info',
  payload?: ToastPayload | JSX.Element,
  promise?: Promise<T> | (() => Promise<T>),
  translate: boolean = true
) {
  const content = generateContent(type, payload)

  if (!promise) {
    return toaster.show(props => (
      <Toast
        class={`toast--${type}`}
        toastId={props.toastId}
        payload={content}
        translate={translate}
      />
    ))
  } else {
    return toaster.promise(promise, props => (
      <Toast
        class={`toast--${type}`}
        toastId={props.toastId}
        state={props.state}
        payload={content}
        error={props.error}
        data={props.data}
        translate={translate}
      />
    ))
  }
}

export const clearToasts = () => toaster.clear()
export const removeToast = (id: number) => toaster.dismiss(id)

export const updateToast = (
  id: number,
  type: ToastType = 'info',
  payload?: ToastPayload | JSX.Element
) => {
  const content = createMemo(() => generateContent(type, payload))

  return toaster.update(id, props => (
    <Toast class={`toast--${type}`} toastId={props.toastId} payload={content()} />
  ))
}
