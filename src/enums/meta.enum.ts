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

export enum Mode {
  Vertical = 'vertical',
  Single = 'single',
  RTL = 'rtl',
  LTR = 'ltr',
}

export enum Layout {
  L = 'l',
  RAL = 'ral',
  Kindle = 'kindle',
  Edge = 'edge',
}
