export type Primitive = string | number | symbol
export type GenericObject = Record<Primitive, unknown>

export type NestedPaths<T> = T extends Array<infer U>
  ? `${NestedPaths<U>}`
  : T extends object
    ? {
        [K in keyof T & (string | number)]: K extends string
          ? `${K}` | `${K}.${NestedPaths<T[K]>}`
          : string;
      }[keyof T & (string | number)]
    : string

export type NestedPathsForType<T, P> = T extends Array<infer U>
  ? NestedPathsForType<U, P>
  : T extends object
    ? {
        [K in keyof T & (string | number)]: K extends string
          ? T[K] extends P
            ? `${K}` | `${K}.${NestedPathsForType<T[K], P>}`
            : T[K] extends object
              ? `${K}.${NestedPathsForType<T[K], P>}`
              : string
          : string;
      }[keyof T & (string | number)]
    : string

export type Operator = 'AND' | 'OR' | (() => 'AND' | 'OR')

export type FilterMatchMode =
  | 'contains'
  | 'between'
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'exists'
  | 'arrayLength'
  | 'objectMatch'

export type NonObjectMatchMode = Exclude<FilterMatchMode, 'objectMatch'>
export type ComparatorMatchMode = Extract<FilterMatchMode, 'between' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual'>

export interface ComparatorParams {
  dateMode?: boolean
}

export interface ObjectMapFilterParams {
  operator: 'AND' | 'OR'
  properties: Array<{
    key: string
    matchMode: Exclude<FilterMatchMode, 'objectMap'>
  }>
  transformFilterValue?: (value: any) => any
  matchPropertyAtIndex?: boolean
  applyAtRoot?: boolean
}

export type MatchModeCore = ({
  matchMode: Exclude<FilterMatchMode, 'objectStringMap' | 'objectMatch' | ComparatorMatchMode>
} | {
  matchMode: ComparatorMatchMode
  params?: ComparatorParams
} | {
  matchMode: 'objectMatch'
  params: ObjectMapFilterParams | ((value: any) => ObjectMapFilterParams)
})

export type QueryFilter<Paths extends string = string> = {
  key: Paths
  value: any
  operator?: Operator
} & MatchModeCore

export interface QueryFilterGroup<Paths extends string = string> {
  operator: Operator
  filters: QueryFilter<Paths>[]
}

export type FilterOptions<Paths extends string = string> = Array<QueryFilterGroup<Paths>> | Array<QueryFilter<Paths>>

export interface SearchOptions<Paths extends string = string> {
  value: string
  keys: Paths[] | Array<{ key: Paths, caseSensitive?: boolean }>
  caseSensitive?: boolean
}

export interface SortOption<Paths extends string = string> {
  key: Paths
  dir?: 'asc' | 'desc'
  parser?: 'number' | 'boolean' | 'string' | ((value: any) => string | number | boolean | null | undefined)
}

export interface QueryParams<
  T extends GenericObject = GenericObject,
  Paths extends NestedPaths<T> = NestedPaths<T>,
  PrimitivePath extends string = NestedPathsForType<T, string | number | null | boolean | undefined>,
> {
  sort?: SortOption<PrimitivePath> | Array<SortOption<PrimitivePath>>
  search?: SearchOptions<PrimitivePath>
  filter?: FilterOptions<Paths>
  limit?: number
  page?: number
}

export type QueryResult<T extends GenericObject, P extends QueryParams<T>> = P extends { limit: number } ? { totalRows: number, totalPages: number, rows: T[], unpaginatedRows: T[] } : { rows: T[] }

export interface MatchModeProcessorMap {
  equals: ({ value, filter }: { value: any, filter: any }) => boolean
  notEquals: ({ value, filter }: { value: any, filter: any }) => boolean
  exists: ({ value, filter }: { value: any, filter: any }) => boolean
  contains: ({ value, filter }: { value: any, filter: any }) => boolean
  greaterThan: ({ value, filter }: { value: any, filter: any, params?: ComparatorParams }) => boolean
  greaterThanOrEqual: ({ value, filter }: { value: any, filter: any, params?: ComparatorParams }) => boolean
  lessThan: ({ value, filter }: { value: any, filter: any, params?: ComparatorParams }) => boolean
  lessThanOrEqual: ({ value, filter }: { value: any, filter: any, params?: ComparatorParams }) => boolean
  between: ({ value, filter }: { value: any, filter: any, params?: ComparatorParams }) => boolean
  arrayLength: ({ value, filter }: { value: any, filter: any }) => boolean
  objectMatch: ({ value, filter, params }: { value: any, filter: any, params: ObjectMapFilterParams, index?: number }) => boolean
}
