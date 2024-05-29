import { getCategory } from '@/gql/Queries'

export type Mangas =
  | ReturnType<NonNullable<typeof getCategory.__apiType>>['category']['mangas']['nodes']
  | undefined

export type TManga = NonNullable<Mangas>[number]
