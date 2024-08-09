import { Component, createMemo, type JSX } from 'solid-js'
import { MangaMeta, useAppContext } from '@/contexts'
import { AscRadio, Filter, ITabs, Radio, TriStateInput } from '@/components'
import { ChapterSort, ChapterTitle } from '@/enums'
import { getObjectEntries } from '@/helpers'
import './styles.scss'

interface MangaFilterProps {
  mangaMeta: MangaMeta
  updateMangaMeta: (value: Partial<MangaMeta>) => void
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
          label={t('manga.filterTabs.filters.unread')}
          state={props.mangaMeta.ChapterUnread}
          updateState={v => props.updateMangaMeta({ ChapterUnread: v })}
        />
      ),
      downloaded: (
        <TriStateInput
          label={t('manga.filterTabs.filters.downloaded')}
          state={props.mangaMeta.ChapterDownloaded}
          updateState={v => props.updateMangaMeta({ ChapterDownloaded: v })}
        />
      ),
      bookmarked: (
        <TriStateInput
          label={t('manga.filterTabs.filters.bookmarked')}
          state={props.mangaMeta.ChapterBookmarked}
          updateState={v => props.updateMangaMeta({ ChapterBookmarked: v })}
        />
      ),
    },
    sort: sort(),
    display: displayModes(),
  } satisfies ITabs

  return <Filter tabs={tabs} />
}
