import { GlobalMeta, Settings, toLocale } from '.'
import { initialGlobalMeta, initialLocale, initialSettings, initialTheme } from './initial'

export function deserializeSettings(value: string): Settings {
  const parsed = JSON.parse(value) as unknown
  if (!parsed || typeof parsed !== 'object') return initialSettings()

  return {
    locale:
      ('locale' in parsed && typeof parsed.locale === 'string' && toLocale(parsed.locale)) ||
      initialLocale(),
    theme:
      ('theme' in parsed && typeof parsed.theme === 'string' && parsed.theme) || initialTheme(),
  }
}

export function deserializeGlobalMeta(value: string): GlobalMeta {
  const parsed = JSON.parse(value) as unknown
  if (!parsed || typeof parsed !== 'object') return initialGlobalMeta()

  return {
    updatesCount:
      ('updatesCount' in parsed &&
        typeof parsed.updatesCount === 'number' &&
        parsed.updatesCount) ||
      0,
  }
}
