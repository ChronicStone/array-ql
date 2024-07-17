export type Primitive = string | number | symbol
export type GenericObject = Record<Primitive, unknown>

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

export type QueryFilter = {
  key: string
  value: any
  operator?: Operator
} & MatchModeCore

export interface QueryFilterGroup {
  operator: Operator
  filters: QueryFilter[]
}

export type FilterOptions = Array<QueryFilterGroup> | Array<QueryFilter>

export interface SearchOptions {
  value: string
  keys: string[] | Array<{ key: string, caseSensitive?: boolean }>
  caseSensitive?: boolean
}

export interface SortOptions {
  key: string
  dir?: 'asc' | 'desc'
  parser?: 'number' | 'boolean' | 'string' | ((value: any) => string | number | boolean | null | undefined)
}

export interface QueryParams {
  sort?: SortOptions | Array<SortOptions>
  search?: SearchOptions
  filter?: FilterOptions
  limit?: number
  page?: number
}

export type QueryResult<T extends GenericObject, P extends QueryParams> = P extends { limit: number } ? { totalRows: number, totalPages: number, rows: T[], unpaginatedRows: T[] } : { rows: T[] }

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
