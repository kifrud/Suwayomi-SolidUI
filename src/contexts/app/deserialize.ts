import { Settings, toLocale } from '.'
import { initialLocale, initialSettings } from './initial'

export function deserializeSettings(value: string): Settings {
  const parsed = JSON.parse(value) as unknown
  if (!parsed || typeof parsed !== 'object') return initialSettings()

  return {
    locale:
      ('locale' in parsed && typeof parsed.locale === 'string' && toLocale(parsed.locale)) ||
      initialLocale(),
  }
}
