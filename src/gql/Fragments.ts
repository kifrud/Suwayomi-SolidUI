import { graphql } from '@/gql'

export const TrackRecordTypeFragment = graphql(
  `
    fragment TrackRecordTypeFragment on TrackRecordType {
      id
      mangaId
      remoteId
      remoteUrl
      title
      trackerId
      status
      displayScore
    }
  `,
  []
)

export const ChapterTypeFragment = graphql(
  `
    fragment ChapterTypeFragment on ChapterType {
      manga {
        id
      }
      isBookmarked
      isDownloaded
      isRead
      id
      chapterNumber
      fetchedAt
      lastPageRead
      name
      sourceOrder
      uploadDate
      pageCount
      scanlator
    }
  `,
  []
)

export const MangaTypeFragment = graphql(
  `
    fragment MangaTypeFragment on MangaType {
      artist
      author
      description
      genre
      id
      inLibrary
      lastFetchedAt
      realUrl
      status
      title
      thumbnailUrl
      unreadCount
      downloadCount
      latestFetchedChapter {
        fetchedAt
        id
      }
      latestUploadedChapter {
        uploadDate
        id
      }
      lastReadChapter {
        lastReadAt
        id
      }
      meta {
        value
        key
      }
      source {
        displayName
        id
      }
      categories {
        nodes {
          id
        }
      }
      trackRecords {
        nodes {
          ...TrackRecordTypeFragment
        }
      }
    }
  `,
  [TrackRecordTypeFragment]
)

export const MangaUpdaterTypeFragment = graphql(
  `
    fragment MangaUpdaterTypeFragment on MangaType {
      id
      title
      thumbnailUrl
    }
  `,
  []
)

export const SourceTypeFragment = graphql(
  `
    fragment SourceTypeFragment on SourceType {
      id
      displayName
      iconUrl
      lang
      meta {
        value
        key
      }
    }
  `,
  []
)

export const ExtensionTypeFragment = graphql(
  `
    fragment ExtensionTypeFragment on ExtensionType {
      name
      repo
      versionName
      pkgName
      lang
      iconUrl
      isNsfw
      isInstalled
      isObsolete
      hasUpdate
    }
  `,
  []
)

export const CategoryTypeFragment = graphql(
  `
    fragment CategoryTypeFragment on CategoryType {
      id
      default
      order
      name
      includeInDownload
      includeInUpdate
      mangas {
        totalCount
        nodes {
          id
        }
      }
    }
  `,
  []
)

export const CategoryUpdaterTypeFragment = graphql(
  `
    fragment CategoryUpdaterTypeFragment on CategoryType {
      id
      name
      includeInUpdate
      includeInDownload
    }
  `,
  []
)

export const TrackerTypeFragment = graphql(
  `
    fragment TrackerTypeFragment on TrackerType {
      authUrl
      icon
      id
      isLoggedIn
      name
      scores
      statuses {
        name
        value
      }
    }
  `,
  []
)

export const PreferenceFragment = graphql(
  `
    fragment PreferenceFragment on Preference {
      ... on CheckBoxPreference {
        __typename
        CheckBoxCheckBoxCurrentValue: currentValue
        summary
        CheckBoxDefault: default
        key
        CheckBoxTitle: title
      }
      ... on EditTextPreference {
        __typename
        EditTextCurrentValue: currentValue
        EditTextDefault: default
        EditTextTitle: title
        text
        summary
        key
        dialogTitle
        dialogMessage
      }
      ... on SwitchPreference {
        __typename
        SwitchCurrentValue: currentValue
        summary
        key
        SwitchDefault: default
        SwitchTitle: title
      }
      ... on MultiSelectListPreference {
        __typename
        dialogMessage
        dialogTitle
        MultiSelectListTitle: title
        summary
        key
        entryValues
        entries
        MultiSelectListDefault: default
        MultiSelectListCurrentValue: currentValue
      }
      ... on ListPreference {
        __typename
        ListCurrentValue: currentValue
        ListDefault: default
        ListTitle: title
        summary
        key
        entryValues
        entries
      }
    }
  `,
  []
)

export const FilterFragment = graphql(
  `
    fragment FilterFragment on Filter {
      ... on TriStateFilter {
        __typename
        name
        TriStateDefault: default
      }
      ... on CheckBoxFilter {
        __typename
        CheckBoxDefault: default
        name
      }
      ... on TextFilter {
        __typename
        name
        TextDefault: default
      }
      ... on SortFilter {
        __typename
        values
        name
        SortDefault: default {
          ascending
          index
        }
      }
      ... on SeparatorFilter {
        __typename
        name
      }
      ... on SelectFilter {
        __typename
        values
        name
        SelectDefault: default
      }
      ... on HeaderFilter {
        __typename
        name
      }
    }
  `,
  []
)

export const UpdateStatusFragment = graphql(
  `
    fragment UpdateStatusFragment on UpdateStatus {
      isRunning
      completeJobs {
        mangas {
          nodes {
            ...MangaTypeFragment
            unreadCount
            downloadCount
            chapters {
              totalCount
            }
          }
          totalCount
        }
      }
      failedJobs {
        mangas {
          nodes {
            ...MangaUpdaterTypeFragment
          }
          totalCount
        }
      }
      pendingJobs {
        mangas {
          nodes {
            ...MangaUpdaterTypeFragment
          }
          totalCount
        }
      }
      runningJobs {
        mangas {
          nodes {
            ...MangaUpdaterTypeFragment
          }
          totalCount
        }
      }
      skippedJobs {
        mangas {
          nodes {
            ...MangaUpdaterTypeFragment
          }
          totalCount
        }
      }
      updatingCategories {
        categories {
          nodes {
            ...CategoryUpdaterTypeFragment
          }
        }
      }
      skippedCategories {
        categories {
          nodes {
            ...CategoryUpdaterTypeFragment
          }
        }
      }
    }
  `,
  [CategoryUpdaterTypeFragment, MangaUpdaterTypeFragment, MangaTypeFragment]
)

export const DownloadStatusFragment = graphql(`
  fragment DownloadStatusFragment on DownloadStatus {
    queue {
      chapter {
        id
        name
        sourceOrder
        isDownloaded
        manga {
          id
          title
          downloadCount
        }
      }
      progress
      state
      tries
    }
    state
  }
`)
