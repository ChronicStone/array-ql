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
  | 'objectStringMap'
  | 'arrayLength'
  | 'objectMatch'

export type NonObjectMatchMode = Exclude<FilterMatchMode, 'objectStringMap' | 'objectMatch'>
export type ComparatorMatchMode = Extract<FilterMatchMode, 'between' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual'>

export interface ComparatorParams {
  dateMode?: boolean
}

export interface ObjectMapFilterParams {
  operator: 'AND' | 'OR'
  properties: Array<{
    key: string
    matchMode: Exclude<FilterMatchMode, 'objectStringMap' | 'objectMap'>
  }>
  transformFilterValue?: (value: any) => any
  matchPropertyAtIndex?: boolean
}

export interface ObjectStringMapFilterParams {
  stringMap: Array<
    | string
    | {
      propertyName: string
      matchMode: Exclude<FilterMatchMode, 'objectStringMap'>
    }
  >
  stringMapSeparator?: string
  stringMapOperator?: 'AND' | 'OR'
  dateMode?: boolean
}

export type MatchModeCore = ({
  matchMode: Exclude<FilterMatchMode, 'objectStringMap' | 'objectMatch' | ComparatorMatchMode>
} | {
  matchMode: ComparatorMatchMode
  params?: ComparatorParams
} | {
  matchMode: 'objectStringMap'
  params: ObjectStringMapFilterParams
} | {
  matchMode: 'objectMatch'
  params: ObjectMapFilterParams | ((value: any) => ObjectMapFilterParams)
})

export type QueryFilter = {
  key: string
  value: any
  required?: boolean | undefined
  postCondition?: boolean
  arrayLookup?: Operator
  lookupAtRoot?: boolean
} & MatchModeCore

export interface QueryParams {
  sort?: { key: string, dir?: 'asc' | 'desc' }
  search?: {
    value: string
    keys: string[]
  }
  filter?: QueryFilter[]
  limit?: number
  offset?: number
}
export type QueryResult<T extends GenericObject, P extends QueryParams> = P extends { limit: number } ? { totalRows: number, totalPages: number, rows: T[], unpaginatedRows: T[] } : { totalRows: number, totalPages: number, rows: T[] }

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
  objectStringMap: (p: { value: any, filter: any }) => boolean
  arrayLength: ({ value, filter }: { value: any, filter: any }) => boolean
  objectMatch: ({ value, filter, params }: { value: any, filter: any, params: ObjectMapFilterParams, index?: number }) => boolean
}
