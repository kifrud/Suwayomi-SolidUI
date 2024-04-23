import {
  Accessor,
  JSXElement,
  ParentComponent,
  createContext,
  createSignal,
  useContext,
} from 'solid-js'

interface HeaderState {
  get headerTitle(): Accessor<JSXElement>
  setHeaderTitle(value: JSXElement | null): void
  get headerTitleData(): Accessor<JSXElement>
  setHeaderTitleData(value: JSXElement): void
}

const HeaderContext = createContext<HeaderState>({} as HeaderState)

export const useHeaderContext = () => useContext(HeaderContext)

export const HeaderContextProvider: ParentComponent = props => {
  const [headerTitleData, setHeaderTitleData] = createSignal<JSXElement>()
  const [headerTitle, setHeaderTitle] = createSignal<JSXElement>(null)

  const state: HeaderState = {
    get headerTitleData() {
      return headerTitleData
    },
    setHeaderTitleData(value) {
      setHeaderTitleData(value)
    },
    get headerTitle() {
      return headerTitle
    },
    setHeaderTitle(value) {
      setHeaderTitle(value)
    },
  }

  return <HeaderContext.Provider value={state}>{props.children}</HeaderContext.Provider>
}
