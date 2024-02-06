import { type Catalog } from '../../entities/entities'

export interface IStorage {
  getCatalog: (fileName: string) => Promise<Catalog>
  putCatalog: (fileName: string, catalog: string) => Promise<void>
}
