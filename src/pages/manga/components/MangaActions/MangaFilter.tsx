import { Component, ErrorBoundary, For, Show, createMemo, createSignal, type JSX } from 'solid-js'
import { Dictionary, MangaMeta, useAppContext } from '@/contexts'
import { AscRadio, Radio, TriStateInput } from '@/components'
import { ChapterSort, ChapterTitle } from '@/enums'
import './styles.scss'
import { getObjectEntries } from '@/helpers'
import { Tabs } from '@kobalte/core/tabs'

interface MangaFilterProps {
  mangaMeta: MangaMeta
  updateMangaMeta: (value: Partial<MangaMeta>) => void
}

interface ITabs {
  filters: {
    unread: JSX.Element
    downloaded: JSX.Element
    bookmarked: JSX.Element
  }
  sort: {
    [k in ChapterSort]: JSX.Element
  }
  display: {
    [k in ChapterTitle]: JSX.Element
  }
}

export const MangaFilter: Component<MangaFilterProps> = props => {
  const { t } = useAppContext()

  const sort = createMemo(() =>
    Object.fromEntries(
      getObjectEntries(ChapterSort).map(([key, value]) => [
        key as keyof ChapterSort,
        <AscRadio
          label={t(`manga.filterTabs.sort.${value}`)}
          updateValue={v => props.updateMangaMeta({ ChapterSort: v as ChapterSort })}
          ascending={props.mangaMeta.ChapterAsc}
          updateAscending={v => props.updateMangaMeta({ ChapterAsc: v })}
          name="sort"
          checked={props.mangaMeta.ChapterSort === value}
          value={value}
        />,
      ])
    )
  )

  const displayModes = createMemo(() =>
    Object.fromEntries(
      getObjectEntries(ChapterTitle).map(([key, value]) => [
        key,
        <Radio
          label={t(`manga.filterTabs.display.${value}`)}
          name="display"
          value={value}
          onClick={e =>
            props.updateMangaMeta({ ChapterTitle: e.currentTarget.value as ChapterTitle })
          }
          checked={props.mangaMeta.ChapterTitle === value}
        />,
      ])
    )
  )

  const tabs = {
    filters: {
      unread: (
        <TriStateInput
          state={props.mangaMeta.ChapterUnread}
          updateState={v => props.updateMangaMeta({ ChapterUnread: v })}
        />
      ),
      downloaded: (
        <TriStateInput
          state={props.mangaMeta.ChapterDownloaded}
          updateState={v => props.updateMangaMeta({ ChapterDownloaded: v })}
        />
      ),
      bookmarked: (
        <TriStateInput
          state={props.mangaMeta.ChapterBookmarked}
          updateState={v => props.updateMangaMeta({ ChapterBookmarked: v })}
        />
      ),
    },
    sort: sort() as {
      [k in ChapterSort]: JSX.Element
    },
    display: displayModes() as {
      [k in ChapterTitle]: JSX.Element
    },
  } satisfies ITabs

  const [tab, setTab] = createSignal(Object.keys(tabs)[0])

  return (
    <div class="manga-actions">
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
                <For each={Object.values(data)}>{item => item}</For>
              </Tabs.Content>
            </ErrorBoundary>
          )}
        </For>
      </Tabs>
    </div>
  )
}
