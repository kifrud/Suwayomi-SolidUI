import { Tabs } from '@kobalte/core/tabs'
import { Component, ErrorBoundary, For, JSX, Show, createMemo, createSignal } from 'solid-js'
import { useAppContext, useGlobalMeta } from '@/contexts'
import { AscRadio, CheckBox, Radio, TriStateInput } from '@/components'
import { Display, Sort, TriState } from '@/enums'
import { GlobalMeta } from '@/contexts/meta/globalMeta'

interface ITabs {
  filters: {
    unread: JSX.Element
    // bookmarked: JSX.Element
    downloaded: JSX.Element
    tracked: JSX.Element
  }
  sort: {
    [k in Sort]: JSX.Element
  }
  display: {
    modes: {
      [k in Display]: JSX.Element
    }
    badges: {
      downloads: JSX.Element
      unreads: JSX.Element
    }
    tabs: {
      showCount: JSX.Element
    }
    other: {
      resumeButton: JSX.Element
    }
  }
}

export const LibraryFilter: Component = () => {
  const { t } = useAppContext()
  const metaCtx = useGlobalMeta()

  const setRadio: JSX.EventHandler<HTMLInputElement, MouseEvent> = e => {
    e.stopPropagation()
    metaCtx.set({ Display: e.currentTarget.value as Display })
  }

  // createEffect(() => console.log(metaCtx.globalMeta.Display))

  const displayModes = createMemo(() =>
    Object.fromEntries(
      Object.entries(Display).map(([key, value]) => [
        key,
        <Radio
          label={t(`library.filterTabs.display.modes.${value}`)}
          name="display"
          value={value}
          onClick={setRadio}
          // onChange={e => {
          //   metaCtx.set({ Display: e.currentTarget.value as Display })
          // }}
          checked={metaCtx.globalMeta.Display === value}
        />,
      ])
    )
  )

  // createEffect(() =>
  //   console.log(
  //     metaCtx.globalMeta.Asc,
  //     metaCtx.globalMeta.Sort,
  //     'UnreadFilter: ',
  //     metaCtx.globalMeta.Unread
  //   )
  // )

  const sorts = createMemo(() =>
    Object.fromEntries(
      Object.entries(Sort).map(([key, value]) => [
        key,
        <AscRadio
          label={key}
          updateValue={v => metaCtx.set({ Sort: v as Sort })}
          ascending={metaCtx.globalMeta.Asc}
          // updateState={v => metaCtx.set({ Sort: v })}
          updateAscending={v => metaCtx.set({ Asc: v })}
          name="sort"
          // onClick={e => metaCtx.set({ [key]: e.currentTarget.value })}
          checked={metaCtx.globalMeta.Sort === value}
          value={value}
        />,
      ])
    )
  )

  const setTriState = (key: keyof GlobalMeta, v: TriState) => {
    metaCtx.set({ [key]: v })
  }

  const setCheckBox = (key: keyof GlobalMeta, v: boolean) => {
    metaCtx.set({ [key]: v })
  }

  // TODO: translate
  const tabs: ITabs = {
    filters: {
      unread: (
        <TriStateInput
          label={t(`library.filterTabs.filters.unread`)}
          state={metaCtx.globalMeta.Unread}
          updateState={v => setTriState('Unread', v)}
        />
      ),
      downloaded: (
        <TriStateInput
          label={t(`library.filterTabs.filters.downloaded`)}
          state={metaCtx.globalMeta.Downloaded}
          updateState={v => setTriState('Downloaded', v)}
        />
      ),
      tracked: (
        <TriStateInput
          label={t(`library.filterTabs.filters.tracked`)}
          state={metaCtx.globalMeta.Tracked}
          updateState={v => setTriState('Tracked', v)}
        />
      ),
    },
    sort: sorts() as {
      [k in Sort]: JSX.Element
    },
    display: {
      modes: displayModes() as {
        [k in Display]: JSX.Element
      },
      badges: {
        // TODO: translate
        downloads: (
          <CheckBox
            checked={metaCtx.globalMeta.downloadsBadge}
            updateState={v => setCheckBox('downloadsBadge', v)}
          />
        ),
        unreads: (
          <CheckBox
            label="asd"
            checked={metaCtx.globalMeta.unreadsBadge}
            updateState={v => setCheckBox('unreadsBadge', v)}
          />
        ),
      },
      tabs: {
        showCount: (
          <CheckBox
            checked={metaCtx.globalMeta.libraryCategoryTotalCounts}
            updateState={v => setCheckBox('libraryCategoryTotalCounts', v)}
          />
        ),
      },
      other: {
        resumeButton: (
          <CheckBox
            label="res"
            checked={metaCtx.globalMeta.libraryResumeButton}
            updateState={v => setCheckBox('libraryResumeButton', v)}
          />
        ),
      },
    },
  }
  // FIXME: not properly checking
  const isElement = (obj: object): obj is Element => {
    return (
      obj instanceof Node ||
      Array.isArray(obj) ||
      (typeof obj === 'string' && typeof obj !== 'boolean' && typeof obj !== 'number')
    )
  }

  const [tab, setTab] = createSignal(Object.keys(tabs)[0])

  return (
    <div class="library-filters">
      <Tabs value={tab()} onChange={setTab} class="flex flex-col h-full gap-2">
        <Tabs.List class="flex items-center relative justify-between">
          <For each={Object.keys(tabs)}>
            {tabName => (
              <Tabs.Trigger value={tabName} class="py-2 px-4">
                {t(`library.filterTabs.${tabName as keyof ITabs}.name`)}
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator class="h-[2px] transition-all duration-[250ms] absolute bottom-0 left-0 bg-foreground" />
        </Tabs.List>
        <For each={Object.entries(tabs)}>
          {(
            [name, data] // FIXME: still type issue
          ) => (
            <ErrorBoundary
              fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}
            >
              <Tabs.Content value={name} class="flex flex-col gap-2 px-2">
                <For each={Object.entries(data)}>
                  {([key, item]) => (
                    <Show when={!isElement(item as object)} fallback={item as Element}>
                      <div class="flex flex-col gap-1">
                        <span class="opacity-50">
                          {/* FIXME: types issue */}
                          {t(
                            `library.filterTabs.${name as keyof typeof tabs}.${String(
                              key as keyof typeof data
                            )}.name` as any
                          )}
                        </span>
                        <For each={Object.values(item as Object)}>
                          {subItem => subItem as Element}
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
