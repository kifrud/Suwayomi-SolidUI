import {
  CategoryTypeFragment,
  ChapterTypeFragment,
  ExtensionTypeFragment,
  FilterFragment,
  MangaTypeFragment,
  PreferenceFragment,
  SourceTypeFragment,
  TrackerTypeFragment,
  TrackRecordTypeFragment,
  UpdateStatusFragment,
} from './Fragments'
import { graphql } from './graphql'

export const getCategories = graphql(
  `
    query categories($notEqualTo: Int = null) {
      categories(filter: { id: { notEqualTo: $notEqualTo } }) {
        nodes {
          ...CategoryTypeFragment
        }
      }
    }
  `,
  [CategoryTypeFragment]
)

export const getCategory = graphql(
  `
    query category($id: Int!) {
      category(id: $id) {
        id
        mangas {
          nodes {
            id
            title
            inLibrary
            thumbnailUrl
            unreadCount
            downloadCount
            bookmarkCount
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
            trackRecords {
              nodes {
                ...TrackRecordTypeFragment
              }
            }
            chapters {
              totalCount
            }
          }
        }
      }
    }
  `,
  [TrackRecordTypeFragment]
)

export const getManga = graphql(
  `
    query getManga($id: Int!) {
      manga(id: $id) {
        ...MangaTypeFragment
        chapters {
          totalCount
          nodes {
            ...ChapterTypeFragment
          }
        }
      }
    }
  `,
  [ChapterTypeFragment, MangaTypeFragment]
)

export const getSingleChapter = graphql(
  `
    query getSingleChapter($id: Int!) {
      chapter(id: $id) {
        ...ChapterTypeFragment
      }
    }
  `,
  [ChapterTypeFragment]
)

export const getExtensions = graphql(
  `
    query getExtensions($isNsfw: Boolean = null) {
      extensions(condition: { isNsfw: $isNsfw }) {
        nodes {
          ...ExtensionTypeFragment
        }
      }
    }
  `,
  [ExtensionTypeFragment]
)

export const getSources = graphql(
  `
    query getSources($isNsfw: Boolean = null) {
      sources(condition: { isNsfw: $isNsfw }) {
        nodes {
          ...SourceTypeFragment
          isNsfw
          extension {
            pkgName
            repo
          }
        }
      }
    }
  `,
  [SourceTypeFragment]
)

export const sourcesMigration = graphql(
  `
    query sourcesMigration {
      sources {
        nodes {
          ...SourceTypeFragment
        }
      }
      mangas(condition: { inLibrary: true }) {
        totalCount
        nodes {
          id
          sourceId
        }
      }
    }
  `,
  [SourceTypeFragment]
)

export const sourceMigrationManga = graphql(
  `
    query sourceMigrationManga($sourceId: LongString!) {
      mangas(condition: { inLibrary: true, sourceId: $sourceId }) {
        nodes {
          id
          title
          thumbnailUrl
        }
      }
    }
  `,
  []
)

export const sourceMigrationSource = graphql(
  `
    query sourceMigrationSource($sourceId: LongString!) {
      source(id: $sourceId) {
        displayName
        id
      }
    }
  `,
  []
)

export const MangaTitleMigration = graphql(
  `
    query MangaTitleMigration($id: Int!) {
      manga(id: $id) {
        title
      }
    }
  `,
  []
)

export const InfoForMigration = graphql(
  `
    query InfoForMigration($id: Int!) {
      manga(id: $id) {
        chapters {
          nodes {
            id
            isRead
            isBookmarked
            chapterNumber
          }
        }
        categories {
          nodes {
            id
          }
        }
      }
    }
  `,
  []
)

export const metas = graphql(
  `
    query metas {
      metas {
        nodes {
          value
          key
        }
      }
    }
  `,
  []
)

export const updates = graphql(
  `
    query updates($offset: Int = 0) {
      chapters(
        orderBy: FETCHED_AT
        offset: $offset
        first: 100
        orderByType: DESC
        filter: { inLibrary: { equalTo: true } }
      ) {
        nodes {
          id
          name
          fetchedAt
          isBookmarked
          isDownloaded
          isRead
          manga {
            id
            title
            thumbnailUrl
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `,
  []
)

export const chapters = graphql(
  `
    query chapters($id: Int!) {
      manga(id: $id) {
        id
        title
        meta {
          value
          key
        }
        chapters {
          nodes {
            id
            name
            pageCount
            lastPageRead
            sourceOrder
          }
        }
      }
    }
  `,
  []
)

export const getSource = graphql(
  `
    query source($id: LongString!) {
      source(id: $id) {
        displayName
        id
        lang
        name
        supportsLatest
        isConfigurable
        preferences {
          ...PreferenceFragment
        }
        filters {
          ...FilterFragment
          ... on GroupFilter {
            __typename
            name
            filters {
              ...FilterFragment
            }
          }
        }
      }
    }
  `,
  [FilterFragment, PreferenceFragment]
)

export const validateBackup = graphql(
  `
    query validateBackup($backup: Upload!) {
      validateBackup(input: { backup: $backup }) {
        missingSources {
          id
          name
        }
      }
    }
  `,
  []
)

export const ConditionalChaptersOfGivenManga = graphql(
  `
    query ConditionalChaptersOfGivenManga(
      $in: [Int!]!
      $isBookmarked: Boolean = null
      $isDownloaded: Boolean = null
      $isRead: Boolean = null
    ) {
      chapters(
        filter: { mangaId: { in: $in } }
        condition: { isDownloaded: $isDownloaded, isRead: $isRead, isBookmarked: $isBookmarked }
      ) {
        nodes {
          id
        }
      }
    }
  `,
  []
)

export const getabout = graphql(
  `
    query getabout {
      aboutServer {
        buildTime
        buildType
        discord
        github
        name
        revision
        version
      }
    }
  `,
  []
)

export const restoreStatus = graphql(
  `
    query restoreStatus($id: String!) {
      restoreStatus(id: $id) {
        mangaProgress
        state
        totalManga
      }
    }
  `,
  []
)

export const trackers = graphql(
  `
    query trackers($isLoggedIn: Boolean = null) {
      trackers(condition: { isLoggedIn: $isLoggedIn }) {
        nodes {
          ...TrackerTypeFragment
        }
      }
    }
  `,
  [TrackerTypeFragment]
)

export const searchTracker = graphql(
  `
    query searchTracker($query: String!, $trackerId: Int!) {
      searchTracker(input: { query: $query, trackerId: $trackerId }) {
        trackSearches {
          coverUrl
          publishingStatus
          publishingType
          startDate
          summary
          title
          totalChapters
          trackingUrl
          trackerId
          remoteId
        }
      }
    }
  `,
  []
)

// export const trackRecords = graphql(
// 	`
// 		query trackRecords {
// 			trackRecords {
// 				nodes {
// 					...TrackRecordTypeFragment
// 				}
// 			}
// 		}
// 	`,
// 	[TrackRecordTypeFragment]
// );

export const serverSettings = graphql(
  `
    query serverSettings {
      settings {
        autoDownloadNewChapters
        backupInterval
        backupPath
        backupTTL
        backupTime
        basicAuthEnabled
        basicAuthPassword
        basicAuthUsername
        debugLogsEnabled
        downloadAsCbz
        downloadsPath
        electronPath
        excludeCompleted
        excludeEntryWithUnreadChapters
        excludeNotStarted
        extensionRepos
        excludeUnreadChapters
        flareSolverrEnabled
        flareSolverrSessionName
        flareSolverrSessionTtl
        flareSolverrTimeout
        flareSolverrUrl
        globalUpdateInterval
        gqlDebugLogsEnabled
        initialOpenInBrowserEnabled
        ip
        localSourcePath
        maxSourcesInParallel
        port
        socksProxyEnabled
        socksProxyHost
        socksProxyPort
        systemTrayEnabled
        updateMangas
        webUIChannel
        webUIFlavor
        webUIInterface
        webUIUpdateCheckInterval
      }
    }
  `,
  []
)

export const latestUpdateTimestamp = graphql(
  `
    query latestUpdateTimestamp {
      lastUpdateTimestamp {
        timestamp
      }
    }
  `
)

export const updateStatus = graphql(
  `
    query updateStatus {
      updateStatus {
        ...UpdateStatusFragment
      }
    }
  `,
  [UpdateStatusFragment]
)
