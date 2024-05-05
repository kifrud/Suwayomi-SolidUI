import { Tabs } from '@kobalte/core/tabs'
import { Component, For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import { useAppContext, useGlobalMeta } from '@/contexts'
import { AscRadio, CheckBox, Radio, TriStateInput } from '@/components'
import { Display, Sort, TriState } from '@/enums'
import './styles.scss'
import { GlobalMeta } from '@/contexts/meta/globalMeta'

export const LibraryFilter: Component = () => {
  const { t } = useAppContext()
  const metaCtx = useGlobalMeta()

  const displayModes = createMemo(() =>
    Object.fromEntries(
      Object.entries(Display).map(([key, value]) => [
        key,
        <Radio
          label={t(`library.filterTabs.display.modes.${value}`)}
          name="display"
          value={value}
          onClick={e => {
            metaCtx.set({ Display: e.currentTarget.value as Display })
          }}
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
      Object.entries(Sort).map(([key, value]) => {
        console.log(key, value)

        return [
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
        ]
      })
    )
  )

  const setTriState = (key: keyof GlobalMeta, v: TriState) => {
    metaCtx.set({ [key]: v })
  }

  const setCheckBox = (key: keyof GlobalMeta, v: boolean) => {
    metaCtx.set({ [key]: v })
  }

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
      tracked: (
        <TriStateInput
          label={t(`library.filterTabs.filters.tracked`)}
          state={metaCtx.globalMeta.Tracked}
          updateState={v => setTriState('Tracked', v)}
        />
      ),
    },
    sort: sorts(),
    display: {
      modes: displayModes(),
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
            checked={metaCtx.globalMeta.libraryResumeButton}
            updateState={v => setCheckBox('libraryResumeButton', v)}
          />
        ),
      },
    },
  }

  const [tab, setTab] = createSignal(Object.keys(tabs)[0])

  return (
    <div class="library-filters">
      <Tabs value={tab()} onChange={setTab} class="flex flex-col h-full gap-2">
        <Tabs.List class="flex items-center relative justify-between">
          <For each={Object.keys(tabs)}>
            {tabName => (
              <Tabs.Trigger value={tabName} class="py-2 px-4">
                {t(`library.filterTabs.${tabName as keyof typeof tabs}.name`)}
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator class="h-[2px] transition-all duration-[250ms] absolute bottom-0 left-0 bg-foreground" />
        </Tabs.List>
        <For each={Object.entries(tabs)}>
          {([name, data]) => (
            <Tabs.Content value={name} class="flex flex-col gap-2 px-2">
              <For each={Object.entries(data)}>
                {([key, item]) => (
                  <Show when={typeof item === 'object'} fallback={item}>
                    <div class="flex flex-col gap-1">
                      <span class="opacity-50">
                        {/* FIXME: types issue */}
                        {t(
                          `library.filterTabs.${name as keyof typeof tabs}.${
                            key as keyof typeof data
                          }.name` as any
                        )}
                      </span>
                      <For each={Object.values(item)}>{subItem => subItem as Element}</For>
                    </div>
                  </Show>
                )}
              </For>
            </Tabs.Content>
          )}
        </For>
      </Tabs>
    </div>
  )
}
