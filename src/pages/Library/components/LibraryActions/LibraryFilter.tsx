import { Component, type JSX, createMemo } from 'solid-js'
import { GlobalMeta } from '@/contexts'
import { useAppContext, useGlobalMeta } from '@/contexts'
import { AscRadio, CheckBox, Filter, ITabs, Radio, TriStateInput } from '@/components'
import { Display, Sort, TriState } from '@/enums'

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
          label={t(`library.filterTabs.sort.${value}`)}
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
    sort: sorts(),
    display: {
      modes: displayModes(),
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

  return <Filter tabs={tabs} />
}
