import { ParentComponent, createContext, createEffect, createResource, useContext } from 'solid-js'
import { Flatten, Translator, flatten, resolveTemplate, translator } from '@solid-primitives/i18n'
import { dict as en_dict } from '@/locales/en/en'
import { makePersisted } from '@solid-primitives/storage'
import { createStore } from 'solid-js/store'
import { setTheme } from 'solid-theme-provider'
import { initialSettings } from './initial'
import { deserializeSettings } from './deserialize'

type RawDictionary = typeof en_dict
// NOTE: add locales to type
export type Locale = 'en' | 'uk'
export type Dictionary = Flatten<RawDictionary>
const LANG_ALIASES: Partial<Record<string, Locale>> = {
  // fil: 'tl',
}

type DeepPartial<T> = T extends Record<string, unknown> ? { [K in keyof T]?: DeepPartial<T[K]> } : T

const raw_dict_map: Record<Locale, () => Promise<{ dict: DeepPartial<RawDictionary> }>> = {
  en: () => null as any, // en is loaded by default
  uk: () => import('../../locales/uk/uk'),
}

const en_flat_dict: Dictionary = flatten(en_dict)

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === 'en') return en_flat_dict

  const { dict } = await raw_dict_map[locale]()
  const flat_dict = flatten(dict) as RawDictionary
  return { ...en_flat_dict, ...flat_dict }
}

interface AppState {
  get locale(): Locale
  setLocale(value: Locale): void
  t: Translator<Dictionary>
  get theme(): string
  setTheme(value: string): void
}

export const toLocale = (string: string): Locale | undefined =>
  string in raw_dict_map
    ? (string as Locale)
    : string in LANG_ALIASES
    ? (LANG_ALIASES[string] as Locale)
    : undefined

const AppContext = createContext<AppState>({} as AppState)

export const useAppContext = () => useContext(AppContext)

export interface Settings {
  locale: Locale
  theme: string
}

export const AppContextProvider: ParentComponent = props => {
  const [settings, set] = makePersisted(createStore(initialSettings()), {
    deserialize: value => deserializeSettings(value),
  })

  createEffect(() => {
    document.documentElement.lang = settings.locale
  })

  const locale = () => settings.locale

  const [dict] = createResource(locale, fetchDictionary, { initialValue: en_flat_dict })
  const t = translator(dict, resolveTemplate)

  const state: AppState = {
    get locale() {
      return settings.locale
    },
    setLocale(value) {
      set('locale', value)
    },
    t,
    get theme() {
      return settings.theme
    },
    setTheme(value) {
      setTheme(value)
      set('theme', value)
    },
  }

  return <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
}
