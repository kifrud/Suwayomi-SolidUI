import { toaster } from '@kobalte/core/toast'
import { Toast } from '@/components'
import { JSX, createMemo } from 'solid-js'
import { useAppContext } from '@/contexts'
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
    icon: JSX.Element
  }>

export function useNotification<T extends unknown>(
  type: ToastType = 'info',
  payload?: ToastPayload | JSX.Element,
  promise?: Promise<T> | (() => Promise<T>)
) {
  const { t } = useAppContext()

  const defaultTitles: Record<ToastType, string> = {
    success: t('global.notification.title.success'),
    error: t('global.notification.title.error'),
    info: t('global.notification.title.info'),
    warning: t('global.notification.title.warning'),
  }

  const defaultMessages: Record<ToastType, string> = {
    success: t('global.notification.message.success'),
    error: t('global.notification.message.error'),
    info: t('global.notification.message.info'),
    warning: t('global.notification.message.warning'),
  }

  const defaultIcons: Record<ToastType, JSX.Element> = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
  }

  const generateContent = (type: ToastType, payload?: ToastPayload | JSX.Element) => {
    if (typeof payload !== 'object' || !('message' in payload!)) {
      return payload as JSX.Element
    } else {
      const title = payload.title ?? defaultTitles[type]
      const message = payload.message ?? defaultMessages[type]
      const icon = payload.icon ?? defaultIcons[type]

      return {
        title,
        message,
        icon,
      } satisfies ToastPayload
    }
  }

  const content = createMemo(() => generateContent(type, payload))

  let id: number

  if (promise) {
    id = toaster.promise(promise, props => (
      <Toast
        class={`toast--${type}`}
        toastId={props.toastId}
        state={props.state}
        payload={content()}
        error={props.error}
        data={props.data}
      />
    ))
  } else {
    id = toaster.show(props => (
      <Toast class={`toast--${type}`} toastId={props.toastId} payload={content()} />
    ))
  }

  const updateToast = (type: ToastType = 'info', payload?: ToastPayload | JSX.Element) => {
    const content = createMemo(() => generateContent(type, payload))

    return toaster.update(id, props => (
      <Toast class={`toast--${type}`} toastId={props.toastId} payload={content()} />
    ))
  }

  const removeToast = () => toaster.dismiss(id)
  const clearToasts = () => toaster.clear()

  return {
    updateToast,
    removeToast,
    clearToasts,
  }
}
