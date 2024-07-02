import { UpdateStatusFragment } from './Fragments'
import { graphql } from './graphql'

export const downloadChanged = graphql(`
  subscription downloadChanged {
    downloadChanged {
      queue {
        chapter {
          name
          id
        }
        manga {
          title
          thumbnailUrl
          id
        }
        progress
        state
        tries
      }
      state
    }
  }
`)

export const downloadsOnChapters = graphql(`
  subscription downloadsOnChapters {
    downloadChanged {
      queue {
        progress
        state
        chapter {
          id
          sourceOrder
          manga {
            id
          }
        }
        manga {
          id
        }
      }
      state
    }
  }
`)

export const webUIUpdateStatusChange = graphql(`
  subscription webUIUpdateStatusChange {
    webUIUpdateStatusChange {
      info {
        channel
        tag
      }
      state
      progress
    }
  }
`)

export const updateStatusSubscription = graphql(
  `
    subscription updateStatusSubscription {
      updateStatusChanged {
        ...UpdateStatusFragment
      }
    }
  `,
  [UpdateStatusFragment]
)
