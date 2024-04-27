import { JSXElement, ParentComponent, createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

interface HeaderState {
  get headerTitle(): JSXElement
  setHeaderTitle(value: JSXElement | null): void
  get headerTitleData(): JSXElement
  setHeaderTitleData(value: JSXElement): void
  get headerCenter(): JSXElement
  setHeaderCenter(value: JSXElement | null): void
  get headerEnd(): JSXElement
  setHeaderEnd(value: JSXElement | null): void
  clear(): void
}

interface HeaderStore {
  titleData: JSXElement
  title: JSXElement
  center: JSXElement
  end: JSXElement
}

const HeaderContext = createContext<HeaderState>({} as HeaderState)

export const useHeaderContext = () => useContext(HeaderContext)

export const HeaderContextProvider: ParentComponent = props => {
  const [header, setHeader] = createStore<HeaderStore>({
    titleData: null,
    title: null,
    center: null,
    end: null,
  })

  const state: HeaderState = {
    get headerTitleData() {
      return header.titleData
    },
    setHeaderTitleData(value) {
      setHeader('titleData', value)
    },
    get headerTitle() {
      return header.title
    },
    setHeaderTitle(value) {
      setHeader('title', value)
    },
    get headerCenter() {
      return header.center
    },
    setHeaderCenter(value) {
      setHeader('center', value)
    },
    get headerEnd() {
      return header.end
    },
    setHeaderEnd(value) {
      setHeader('end', value)
    },
    clear() {
      setHeader('titleData', null)
      setHeader('title', null)
      setHeader('center', null)
      setHeader('end', null)
    },
  }

  return <HeaderContext.Provider value={state}>{props.children}</HeaderContext.Provider>
}
