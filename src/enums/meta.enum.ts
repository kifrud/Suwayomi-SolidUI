export enum Sort {
  Unread = 'unreadSort',
  Alphabetical = 'alphabetical',
  ID = 'id',
  LatestRead = 'latestRead',
  LatestFetched = 'latestFetched',
  LatestUploaded = 'latestUploaded',
}

export enum Display {
  Compact = 'compact',
  // Comfortable = 'comfortable', // TODO
  // List = 'list',
}

export enum ChapterTitle {
  SourceTitle = 'sourceTitle',
  ChapterNumber = 'chapterNumber',
}

export enum ChapterSort {
  Source = 'source',
  FetchedDate = 'fetchedDate',
  UploadDate = 'uploadDate',
}
