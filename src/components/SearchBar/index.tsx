import {
  Component,
  JSXElement,
  Show,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onMount,
} from 'solid-js'
import { useSearchParams } from '@solidjs/router'
import { useAppContext, useHeaderContext } from '@/contexts'
import { makeFocusListener } from '@solid-primitives/active-element'
import { matches } from '@/helpers'
import { Input } from '../ui'
import SearchIcon from '~icons/material-symbols/search'

const SearchBar: Component<{ mobile?: boolean }> = props => {
  const { t } = useAppContext()
  const headerCtx = useHeaderContext()
  const values = mergeProps({ modile: false }, props)

  const [searchParams, setSearchParams] = useSearchParams()
  const [showInput, setShowInput] = createSignal(false)
  const [searchValue, setSearchValue] = createSignal(searchParams.q ?? '')
  const [isFocused, setIsFocused] = createSignal(false)
  const [prevTitle, setPrevTitle] = createSignal<JSXElement>(null)

  let inputEl!: HTMLInputElement

  const wrapperClasses = createMemo(() =>
    ['lg:w-[512px]', 'md:w-96', 'md:relative', 'md:left-auto', 'w-full', 'z-50', 'left-0'].join(' ')
  )

  onMount(() => {
    setPrevTitle(headerCtx.headerTitle)
    // it sets empty div if null otherwise
    if (headerCtx.headerTitle === null) {
      setPrevTitle(null)
    }
  })

  createEffect(() => {
    if (!matches.md) {
      makeFocusListener(inputEl, focused => setIsFocused(focused))

      if (isFocused()) {
        headerCtx.setHeaderTitle(<div></div>)
      }
      if (!isFocused() && searchValue() === '') {
        setShowInput(false)
        headerCtx.setHeaderTitle(prevTitle())
      }
    }
  })

  const input = (
    <Input
      ref={inputEl}
      type="search"
      placeholder={t('global.search')}
      wrapperClass={wrapperClasses()}
      class="w-full"
      scheme={matches.md ? 'default' : 'underline'}
      radius={matches.md ? 'lg' : 'none'}
      value={searchValue}
      onInput={e => setSearchValue(e.currentTarget.value)}
      onSubmit={() => setSearchParams({ q: searchValue() })}
      icon={<SearchIcon />}
      clearIcon={{
        state: true,
        always: values.mobile,
      }}
      onClear={() => {
        if (searchValue()) {
          setIsFocused(true)
          inputEl.focus()
          setSearchValue('')
        } else {
          setShowInput(false)
        }
      }}
    />
  )

  const showButton = (
    <button
      onClick={() => {
        setIsFocused(true)
        setShowInput(prev => !prev)
        inputEl.focus()
      }}
      class="flex items-center icon-24"
    >
      <SearchIcon />
    </button>
  )

  const mobileSearch = (
    <Show when={showInput()} fallback={showButton}>
      {input}
    </Show>
  )

  return (
    <Show when={!values.mobile} fallback={mobileSearch}>
      {input}
    </Show>
  )
}

export default SearchBar
