import { Component, ErrorBoundary, For, type JSX, Show, createMemo, createSignal } from 'solid-js'
import { Tabs } from '@kobalte/core/tabs'
import { Dictionary, useAppContext, useGlobalMeta } from '@/contexts'
import { AscRadio, CheckBox, Radio, TriStateInput } from '@/components'
import { Display, Sort, TriState } from '@/enums'
import { GlobalMeta } from '@/contexts/meta/globalMeta'

interface ITabs {
  filters: {
    unread: JSX.Element
    bookmarked: JSX.Element
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

  const setTriState = (key: keyof GlobalMeta, v: TriState) => {
    metaCtx.set({ [key]: v })
  }

  const setCheckBox = (key: keyof GlobalMeta, v: boolean) => {
    metaCtx.set({ [key]: v })
  }

  const displayModes = createMemo(() =>
    Object.fromEntries(
      Object.entries(Display).map(([key, value]) => [
        key,
        <Radio
          label={t(`library.filterTabs.display.modes.${value}`)}
          name="display"
          value={value}
          onClick={setRadio}
          checked={metaCtx.globalMeta.Display === value}
        />,
      ])
    )
  )

  const sorts = createMemo(() =>
    Object.fromEntries(
      Object.entries(Sort).map(([key, value]) => [
        key,
        <AscRadio
          label={key}
          updateValue={v => metaCtx.set({ Sort: v as Sort })}
          ascending={metaCtx.globalMeta.Asc}
          updateAscending={v => metaCtx.set({ Asc: v })}
          name="sort"
          checked={metaCtx.globalMeta.Sort === value}
          value={value}
        />,
      ])
    )
  )

  const tabs = {
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
      bookmarked: (
        <TriStateInput
          label={t(`library.filterTabs.filters.bookmarked`)}
          state={metaCtx.globalMeta.Bookmarked}
          updateState={v => setTriState('Bookmarked', v)}
        />
      ),
      // TODO: add trackers
      tracked: (
        <TriStateInput
          label={t(`library.filterTabs.filters.tracked`)}
          state={metaCtx.globalMeta.Tracked}
          updateState={v => setTriState('Tracked', v)}
          isDisabled
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
        downloads: (
          <CheckBox
            label={t('library.filterTabs.display.badges.downloads')}
            checked={metaCtx.globalMeta.downloadsBadge}
            onChange={v => setCheckBox('downloadsBadge', v)}
          />
        ),
        unreads: (
          <CheckBox
            label={t('library.filterTabs.display.badges.unrerads')}
            checked={metaCtx.globalMeta.unreadsBadge}
            onChange={v => setCheckBox('unreadsBadge', v)}
          />
        ),
      },
      tabs: {
        showCount: (
          <CheckBox
            label={t('library.filterTabs.display.tabs.totalCounts')}
            checked={metaCtx.globalMeta.libraryCategoryTotalCounts}
            onChange={v => setCheckBox('libraryCategoryTotalCounts', v)}
          />
        ),
      },
      other: {
        resumeButton: (
          <CheckBox
            label={t('library.filterTabs.display.other.resumeButton')}
            checked={metaCtx.globalMeta.libraryResumeButton}
            onChange={v => setCheckBox('libraryResumeButton', v)}
          />
        ),
      },
    },
  } satisfies ITabs

  const [tab, setTab] = createSignal(Object.keys(tabs)[0])

  return (
    <div class="library-filters">
      <Tabs value={tab()} onChange={setTab} class="flex flex-col h-full gap-2">
        <Tabs.List class="flex items-center relative justify-between">
          <For each={Object.keys(tabs)}>
            {tabName => (
              <Tabs.Trigger value={tabName} class="px-4 py-2">
                <span>{t(`library.filterTabs.${tabName as keyof ITabs}.name`)}</span>
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator class="h-[2px] transition-all duration-[250ms] absolute bottom-0 left-0 bg-foreground" />
        </Tabs.List>
        <For each={Object.entries(tabs)}>
          {([name, data]) => (
            <ErrorBoundary
              fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}
            >
              <Tabs.Content value={name} class="flex flex-col gap-2 px-2">
                <For each={Object.entries(data)}>
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
                              `library.filterTabs.${name as keyof typeof tabs}.${key}.name` as keyof Dictionary
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
