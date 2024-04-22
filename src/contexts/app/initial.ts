import { currentTheme } from 'solid-theme-provider'
import { GlobalMeta, Locale, Settings, toLocale } from '.'

export function initialLocale(): Locale {
  let locale: Locale | undefined

  locale = toLocale(navigator.language.slice(0, 2))
  if (locale) return locale

  locale = toLocale(navigator.language.toLocaleLowerCase())
  if (locale) return locale

  return 'en'
}

export function initialGlobalMeta(): GlobalMeta {
  return {
    updatesCount: 0,
  }
}

export function initialSettings(): Settings {
  return {
    locale: initialLocale(),
    theme: currentTheme(),
  }
}
