export type BaseActions = 'download' | 'markAsRead' | 'markAsUnread' | 'delete'
export type LibraryActions = BaseActions | 'editCategory'
export type ChapterActions = BaseActions | 'bookmark' | 'markAsReadBefore' | 'read'
