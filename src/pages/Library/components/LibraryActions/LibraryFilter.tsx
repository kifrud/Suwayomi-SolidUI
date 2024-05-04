import { Tabs } from '@kobalte/core/tabs'
import { Component, For, JSX, createEffect, createMemo, createSignal } from 'solid-js'
import { useAppContext, useGlobalMeta } from '@/contexts'
import { CheckBox, Radio, TriStateInput } from '@/components'
import { Display, TriState } from '@/enums'
import './styles.scss'
import { GlobalMeta } from '@/contexts/meta/globalMeta'

export const LibraryFilter: Component = () => {
  const { t } = useAppContext()
  const metaCtx = useGlobalMeta()

  createEffect(() =>
    console.log(
      'unread',
      metaCtx.globalMeta.Unread,
      'downloads',
      metaCtx.globalMeta.Downloaded,
      'tracked',
      metaCtx.globalMeta.Tracked
    )
  )

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

  const setFilter = (key: keyof GlobalMeta, v: TriState) => {
    metaCtx.set({ [key]: v })
  }

  const tabs = {
    filters: {
      unread: (
        <TriStateInput
          label={t(`library.filterTabs.filters.unread`)}
          state={metaCtx.globalMeta.Unread}
          updateState={v => setFilter('Unread', v)}
        />
      ),
      downloaded: (
        <TriStateInput
          label={t(`library.filterTabs.filters.downloaded`)}
          state={metaCtx.globalMeta.Downloaded}
          updateState={v => setFilter('Downloaded', v)}
        />
      ),
      tracked: (
        <TriStateInput
          label={t(`library.filterTabs.filters.tracked`)}
          state={metaCtx.globalMeta.Tracked}
          updateState={v => setFilter('Tracked', v)}
        />
      ),
    },
    sort: {},
    display: {
      modes: displayModes(),
      badges: {
        downloads: (
          <CheckBox
            checked={metaCtx.globalMeta.downloadsBadge}
            updateState={v => metaCtx.set({ downloadsBadge: !v })}
          />
        ),
        unreads: <></>,
      },
      tabs: {
        showCount: <></>,
      },
      other: {
        resumeButton: <></>,
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
              {Object.entries(data).map(([key, item]) =>
                (!item satisfies JSX.Element) && (item satisfies Object) ? (
                  <div>
                    <span class="opacity-50">
                      {/* FIXME: types issue */}
                      {t(
                        `library.filterTabs.${name as keyof typeof tabs}.${
                          key as keyof typeof data
                        }.name` as any
                      )}
                    </span>
                    {Object.values(item).map(subItem => subItem as Element)}
                  </div>
                ) : (
                  item
                )
              )}
            </Tabs.Content>
          )}
        </For>
      </Tabs>
    </div>
  )
}
