import type { FilterMatchMode, GenericObject, MatchModeProcessorMap, QueryFilter, QueryFilterGroup, QueryParams, QueryResult } from './types'
import { MatchModeProcessor, getObjectProperty, validateBetweenPayload } from './utils'

export function query<T extends GenericObject, P extends QueryParams>(
  data: T[],
  params: P,
): QueryResult<T, P> {
  let result: T[] = [...data]

  if (params.search && params.search.value) {
    result = result.filter((item) => {
      for (const key of params.search?.keys ?? []) {
        const field = typeof key === 'string' ? key : key.key
        const caseSensitive = typeof key === 'string' ? (params.search?.caseSensitive ?? false) : key.caseSensitive ?? false
        if (processSearchQuery({ key: field, caseSensitive, object: item, value: params.search!.value }))
          return true
      }
      return false
    })
  }

  if (params.sort) {
    const sortArray = Array.isArray(params.sort) ? params.sort : [params.sort]

    result = result.sort((a, b) => {
      for (const { key, dir, parser } of sortArray) {
        const parserHandler = typeof parser === 'function' ? parser : (v: any) => parser === 'number' ? Number(v) : parser === 'boolean' ? Boolean(v) : parser === 'string' ? String(v) : v
        const aParsed = parserHandler(getObjectProperty(a, key)) ?? null
        const bParsed = parserHandler(getObjectProperty(b, key)) ?? null

        if (aParsed !== bParsed) {
          const comparison = (aParsed < bParsed) ? -1 : 1
          return dir === 'asc' ? comparison : -comparison
        }
      }
      return 0
    })
  }

  if (Array.isArray(params.filter) && params.filter.length) {
    result = result.filter((item) => {
      const IS_GROUP = params.filter?.every(filter => 'filters' in filter) ?? false
      const METHOD = IS_GROUP ? 'some' : 'every' as const
      const FILTERS = (params?.filter ?? []) as any[]
      return FILTERS[METHOD]((group: QueryFilter | QueryFilterGroup) => {
        const filters = 'filters' in group ? group.filters : [group]
        const op = 'filters' in group ? group.operator : 'OR'
        return filters[op === 'AND' ? 'every' : 'some' as const]((filter) => {
          const value = getObjectProperty(item, filter.key)
          const operator = typeof filter.operator === 'function' ? filter.operator() : filter.operator ?? 'OR'
          if (filter.matchMode === 'equals') {
            return processFilterWithLookup({
              type: 'equals',
              params: null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'contains') {
            return processFilterWithLookup({
              type: 'contains',
              params: null,
              operator,
              value,
              filter: filter.value,
            })
          }
          if (filter.matchMode === 'between') {
            return processFilterWithLookup({
              type: 'between',
              params: filter?.params ?? null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'greaterThan') {
            return processFilterWithLookup({
              type: 'greaterThan',
              params: filter?.params ?? null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'greaterThanOrEqual') {
            return processFilterWithLookup({
              type: 'greaterThanOrEqual',
              params: filter?.params ?? null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'lessThan') {
            return processFilterWithLookup({
              type: 'lessThan',
              params: filter?.params ?? null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'lessThanOrEqual') {
            return processFilterWithLookup({
              type: 'lessThanOrEqual',
              params: filter?.params ?? null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'exists') {
            return processFilterWithLookup({
              type: 'exists',
              params: null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'arrayLength') {
            return processFilterWithLookup({
              type: 'arrayLength',
              params: null,
              operator,
              value,
              filter: filter.value,
            })
          }

          if (filter.matchMode === 'objectMatch') {
            const params = typeof filter.params === 'function' ? filter.params(filter.value) : filter.params
            const filterValue = params?.transformFilterValue?.(filter.value) ?? filter.value
            return processFilterWithLookup({
              type: 'objectMatch',
              params,
              operator,
              value: params?.applyAtRoot ? item : value,
              filter: filterValue,
            })
          }

          return false
        })
      })
    })
  }

  if (typeof params.limit === 'undefined') {
    return { rows: result } as QueryResult<T, P>
  }

  else {
    const unpaginatedRows = [...result]
    const totalRows = result.length
    const totalPages = Math.ceil(totalRows / params.limit)
    const start = ((params?.page ?? 1) - 1) * params.limit
    const end = start + params.limit
    result = result.slice(start, end)

    return {
      totalRows,
      totalPages,
      rows: result,
      unpaginatedRows,
    } as QueryResult<T, P>
  }
}

function parseSearchValue(value: any, caseSensitive: boolean): string {
  return (caseSensitive ? value?.toString() : value?.toString()?.toLowerCase?.()) ?? ''
}

function processSearchQuery(params: { key: string, object: Record<string, any>, value: string, caseSensitive: boolean }): boolean {
  const { key, object, value, caseSensitive } = params
  const keys = key.split('.')

  let current: any = object
  for (let i = 0; i < keys.length; i++) {
    if (Array.isArray(current))
      return current.some(item => processSearchQuery({ key: keys.slice(i).join('.'), object: item, value, caseSensitive }))

    else if (current && Object.prototype.hasOwnProperty.call(current, keys[i]))
      current = current[keys[i]]

    else
      return false
  }

  if (Array.isArray(current))
    return current.some(element => parseSearchValue(element, caseSensitive).includes(parseSearchValue(value, caseSensitive)))

  else
    return parseSearchValue(current, caseSensitive).includes(parseSearchValue(value, caseSensitive)) ?? false
}

function processFilterWithLookup<
  T extends FilterMatchMode,
  P = Parameters<MatchModeProcessorMap[T]>[0],
>(params: {
  type: FilterMatchMode
  operator: 'AND' | 'OR'
  value: any
  filter: any
  params: P extends { params: infer U } ? U : P extends { params?: infer U } ? U : null
  lookupFrom?: 'value' | 'filter'
}) {
  if (!Array.isArray(params.filter) || (params.type === 'between' && validateBetweenPayload(params.filter))) {
    return Array.isArray(params.value)
      ? params.value.some(value =>
        MatchModeProcessor[params.type]({
          params: params.params as any,
          value,
          filter: params.filter,
        }),
      )
      : MatchModeProcessor[params.type]({ params: params.params as any, value: params.value, filter: params.filter })
  }

  else if (params.operator === 'AND') {
    return Array.isArray(params.filter) && params.filter.every((filter, index) => {
      if (Array.isArray(params.value)) {
        return params.value.some(value =>
          MatchModeProcessor[params.type]({
            params: params.params as any,
            value,
            filter,
            index,
          }),
        )
      }
      else {
        return MatchModeProcessor[params.type]({ params: params.params as any, value: params.value, filter, index })
      }
    })
  }

  else if (params.operator === 'OR') {
    return Array.isArray(params.filter) && params.filter.some((filter, index) =>
      Array.isArray(params.value)
        ? params.value.some(value =>
          MatchModeProcessor[params.type]({
            params: params.params as any,
            value,
            filter,
            index,
          }),
        )
        : MatchModeProcessor[params.type]({ params: params.params as any, value: params.value, filter, index }),
    )
  }

  return false
}
