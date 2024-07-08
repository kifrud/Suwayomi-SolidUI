import { ResultOf } from '@/gql'
import { getCategory, getManga } from '@/gql/Queries'

export type Mangas =
  | ReturnType<NonNullable<typeof getCategory.__apiType>>['category']['mangas']['nodes']
  | undefined

export type TLibraryManga = NonNullable<Mangas>[number]

export type TManga = ResultOf<typeof getManga>
