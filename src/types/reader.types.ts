import { Accessor, Setter } from 'solid-js'
import { TChapter, TManga } from './manga.types'
import { MangaMeta } from '@/contexts'

export interface ReaderProps {
  chapter: TChapter
  manga: TManga
  pages: string[]
  updateCurrentPage: Setter<number>
  currentPage: Accessor<number>
  settings: MangaMeta
  prevChapter: () => void
  nextChapter: () => void
}
