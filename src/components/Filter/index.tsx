import { ErrorBoundary, For, Show, createSignal, type JSX } from 'solid-js'
import { Tabs } from '@kobalte/core/tabs'
import { Dictionary, useAppContext } from '@/contexts'
import { getObjectEntries } from '@/helpers'
import './styles.scss'

export interface ITabs {
  [k: string]:
    | JSX.Element
    | {
        [k1: string]:
          | JSX.Element
          | {
              [k2: string]: JSX.Element
            }
      }
}

interface FilterProps<T extends ITabs> {
  tabs: T
}

export const Filter = <T extends ITabs>(props: FilterProps<T>) => {
  const { t } = useAppContext()
  const [tab, setTab] = createSignal(Object.keys(props.tabs)[0])

  return (
    <div class="filter">
      <Tabs value={tab()} onChange={setTab} class="flex flex-col h-full gap-2">
        <Tabs.List class="flex items-center relative justify-between">
          <For each={Object.keys(props.tabs)}>
            {tabName => (
              <Tabs.Trigger value={tabName} class="px-4 py-2">
                <span>
                  {
                    t(
                      `library.filterTabs.${tabName as keyof ITabs}.name` as keyof Dictionary
                    ) as string
                  }
                </span>
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator class="h-[2px] transition-all duration-[250ms] absolute bottom-0 left-0 bg-foreground" />
        </Tabs.List>
        <For each={getObjectEntries(props.tabs)}>
          {([name, data]) => (
            <ErrorBoundary
              fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}
            >
              <Tabs.Content value={name as string} class="flex flex-col gap-2 px-2">
                <For each={Object.entries(data as object)}>
                  {([key, item]) => (
                    <Show
                      when={
                        import.meta.env.MODE === 'development'
                          ? typeof item !== 'function'
                          : !(item instanceof Element)
                      } // different types of check because in production every function becomes Element
                      fallback={item as JSX.Element}
                    >
                      <div class="flex flex-col gap-1">
                        <span class="opacity-50">
                          {
                            t(
                              `library.filterTabs.${String(name as keyof typeof props.tabs)}.${key}.name` as keyof Dictionary
                            ) as JSX.Element
                          }
                        </span>
                        <For each={Object.values(item as Object)}>
                          {subItem => subItem as JSX.Element}
                        </For>
                      </div>
                    </Show>
                  )}
                </For>
              </Tabs.Content>
            </ErrorBoundary>
          )}
        </For>
      </Tabs>
    </div>
  )
}
