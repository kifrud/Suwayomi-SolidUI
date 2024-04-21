import {
  Accessor,
  JSXElement,
  ParentComponent,
  createContext,
  createEffect,
  createResource,
  createSignal,
  useContext,
} from 'solid-js'
import { Flatten, Translator, flatten, resolveTemplate, translator } from '@solid-primitives/i18n'
import { dict as en_dict } from '@/locales/en/en'
import { makePersisted } from '@solid-primitives/storage'
import { createStore } from 'solid-js/store'
import { currentTheme, setTheme } from 'solid-theme-provider'

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
  uk: () => import('../locales/uk/uk'),
}

const en_flat_dict: Dictionary = flatten(en_dict)

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === 'en') return en_flat_dict

  const { dict } = await raw_dict_map[locale]()
  const flat_dict = flatten(dict) as RawDictionary
  return { ...en_flat_dict, ...flat_dict }
}
// TODO: add settings object and settings setter
interface AppState {
  get locale(): Locale
  setLocale(value: Locale): void
  t: Translator<Dictionary>
  get theme(): string
  setTheme(value: string): void
  get headerData(): Accessor<JSXElement>
  setHeaderData(value: JSXElement): void
}

const toLocale = (string: string): Locale | undefined =>
  string in raw_dict_map
    ? (string as Locale)
    : string in LANG_ALIASES
    ? (LANG_ALIASES[string] as Locale)
    : undefined

function initialLocale(): Locale {
  let locale: Locale | undefined

  locale = toLocale(navigator.language.slice(0, 2))
  if (locale) return locale

  locale = toLocale(navigator.language.toLocaleLowerCase())
  if (locale) return locale

  return 'en'
}

const AppContext = createContext<AppState>({} as AppState)

export const useAppContext = () => useContext(AppContext)
// TODO: gonna use settings later
interface Settings {
  locale: Locale
  theme: string
}

function initialSettings(): Settings {
  return {
    locale: initialLocale(),
    theme: currentTheme(),
  }
}

function deserializeSettings(value: string): Settings {
  const parsed = JSON.parse(value) as unknown
  if (!parsed || typeof parsed !== 'object') return initialSettings()

  return {
    locale:
      ('locale' in parsed && typeof parsed.locale === 'string' && toLocale(parsed.locale)) ||
      initialLocale(),
    theme:
      ('theme' in parsed && typeof parsed.theme === 'string' && parsed.theme) || currentTheme(),
  }
}

export const AppContextProvider: ParentComponent = props => {
  const [headerData, setHeaderData] = createSignal<JSXElement>()
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
    get headerData() {
      return headerData
    },
    setHeaderData(value) {
      setHeaderData(value)
    },
  }

  return <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
}
