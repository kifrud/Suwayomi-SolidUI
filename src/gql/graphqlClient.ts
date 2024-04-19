import { Client, cacheExchange, fetchExchange } from '@urql/core'
// import { cacheExchange } from '@urql/exchange-graphcache'
import { createClient as createWSClient } from 'graphql-ws'

const wsClient = createWSClient({
  url: window.location.origin.replace(/^http/, 'ws') + '/api/graphql',
})

export const client = new Client({
  url: '/api/graphql',
  exchanges: [
    // cacheExchange({
    //   keys: {
    //     MangaNodeList: () => null,
    //     CategoryNodeList: () => null,
    //     ChapterNodeList: () => null,
    //     ExtensionNodeList: () => null,
    //     SourceMetaType: () => null,
    //     SourceNodeList: () => null,
    //     SettingsType: () => null,
    //     GlobalMetaType: () => null,
    //     GlobalMetaNodeList: () => null,
    //     MangaMetaType: () => null,
    //     TrackRecordNodeList: () => null,
    //     TriStateFilter: () => null,
    //     TextFilter: () => null,
    //     ListPreference: () => null,
    //     SwitchPreference: () => null,
    //     MultiSelectListPreference: () => null,
    //     EditTextPreference: () => null,
    //     CheckBoxPreference: () => null,
    //     SeparatorFilter: () => null,
    //     HeaderFilter: () => null,
    //     SortFilter: () => null,
    //     SortSelection: () => null,
    //     CheckBoxFilter: () => null,
    //     GroupFilter: () => null,
    //     SelectFilter: () => null,
    //     SearchTrackerPayload: () => null,
    //     TrackSearchType: e => e.remoteId!.toString(),
    //     TrackRecordType: e => e.id!.toString(),
    //     ExtensionType: e => (e.pkgName as string) + (e.versionName as string) + e.repo,
    //     TrackStatusType: () => null,
    //     TrackerNodeList: () => null,
    //   },
    // }),
    cacheExchange,
    fetchExchange,
  ],
})
