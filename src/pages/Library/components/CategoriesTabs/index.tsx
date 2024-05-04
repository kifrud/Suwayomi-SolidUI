import { Accessor, Component, For, Setter, Show } from 'solid-js'
import { Tabs } from '@kobalte/core/tabs'
import { useSearchParams } from '@solidjs/router'
import { Chip } from '@/components'
import './styles.scss'
import { useGlobalMeta } from '@/contexts'

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
  const { globalMeta } = useGlobalMeta()
  const [, setSearchParams] = useSearchParams()

  const onChange = (value: string) => {
    setSearchParams({ tab: value })
    props.updateValue(value)
  }

  return (
    <Tabs value={props.value()} onChange={onChange} class="tabs">
      <Tabs.List class="tabs__list">
        <For each={props.categories()}>
          {item => (
            <Tabs.Trigger
              class="flex items-center gap-1 px-4 py-2 pb-2 transition-all hover:opacity-100"
              classList={{
                'opacity-100': props.value() === item.id.toString(),
                'opacity-75': props.value() !== item.id.toString(),
              }}
              value={item.id.toString()}
            >
              <span>{item.name}</span>
              <Show when={globalMeta.libraryCategoryTotalCounts}>
                <Chip>{item.mangas.totalCount}</Chip>
              </Show>
            </Tabs.Trigger>
          )}
        </For>
        <Tabs.Indicator class="tabs__indicator" />
      </Tabs.List>
    </Tabs>
  )
}

export default CategoriesTabs
