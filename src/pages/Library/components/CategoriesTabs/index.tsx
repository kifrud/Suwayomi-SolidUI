import { Accessor, Component, For, Setter } from 'solid-js'
import { Tabs } from '@kobalte/core'
import { useSearchParams } from '@solidjs/router'
import { Chip } from '@/components'
import './styles.scss'

interface CategoriesTabsProps {
  categories: Accessor<
    | {
        mangas: {
          totalCount: number
        }
        includeInUpdate: 'EXCLUDE' | 'INCLUDE' | 'UNSET'
        includeInDownload: 'EXCLUDE' | 'INCLUDE' | 'UNSET'
        name: string
        order: number
        default: boolean
        id: number
      }[]
    | undefined
  >
  value: Accessor<string>
  updateValue: Setter<string>
}

const CategoriesTabs: Component<CategoriesTabsProps> = props => {
  const [, setSearchParams] = useSearchParams()

  const onChange = (value: string) => {
    setSearchParams({ tab: value })
    props.updateValue(value)
  }

  return (
    <Tabs.Root value={props.value()} onChange={onChange} class="tabs">
      <Tabs.List class="tabs__list">
        <For each={props.categories()}>
          {item => (
            <Tabs.Trigger
              class="flex items-center gap-1 px-4 py-1 pb-2 transition-all opacity-75 hover:opacity-100"
              classList={{ 'opacity-100': props.value() === item.id.toString() }}
              value={item.id.toString()}
            >
              <span>{item.name}</span>
              <Chip>{item.mangas.totalCount}</Chip>
            </Tabs.Trigger>
          )}
        </For>
        <Tabs.Indicator class="tabs__indicator" />
      </Tabs.List>
    </Tabs.Root>
  )
}

export default CategoriesTabs
