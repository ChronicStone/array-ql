import type { GenericObject, QueryFilter, QueryFilterGroup, QueryParams, QueryResult } from './types'
import { getObjectProperty, processFilterWithLookup, processSearchQuery } from './utils'

export function query<T extends GenericObject, P extends QueryParams<T>>(
  data: T[],
  params: P,
): QueryResult<T, P> {
  let result = Array.from(lazyQuery(data, params))

  if (params.sort)
    result = sortedQuery(result, params.sort)

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

function* lazyQuery<T extends GenericObject>(data: T[], params: QueryParams<T>): Generator<T> {
  for (const item of data) {
    if (matchesSearchAndFilters(item, params)) {
      yield item
    }
  }
}

function matchesSearchAndFilters<T extends GenericObject>(item: T, params: QueryParams<T>): boolean {
  return matchesSearch(item, params.search) && matchesFilters(item, params.filter)
}

function matchesSearch<T extends GenericObject>(item: T, search?: QueryParams<T>['search']): boolean {
  if (!search || !search.value)
    return true

  return search.keys.some((key) => {
    const field = typeof key === 'string' ? key : key.key
    const caseSensitive = typeof key === 'string' ? (search.caseSensitive ?? false) : key.caseSensitive ?? false
    return processSearchQuery({ key: field, caseSensitive, object: item, value: search.value })
  })
}

function matchesFilters<T extends GenericObject>(item: T, filters?: (QueryFilter | QueryFilterGroup)[]): boolean {
  if (!filters || filters.length === 0)
    return true
  const isGroup = filters.every(filter => 'filters' in filter)
  const method = isGroup ? 'some' : 'every'
  return filters[method]((group: QueryFilter | QueryFilterGroup) => {
    const groupFilters = 'filters' in group ? group.filters : [group]
    const op = 'filters' in group ? group.operator : 'OR'
    return groupFilters[op === 'AND' ? 'every' : 'some']((filter: QueryFilter) => {
      const value = getObjectProperty(item, filter.key)
      const operator = typeof filter.operator === 'function' ? filter.operator() : filter.operator ?? 'OR'
      const params = (!('params' in filter) ? null : typeof filter.params === 'function' ? filter.params(filter.value) : filter.params) ?? null
      return processFilterWithLookup({
        type: filter.matchMode,
        params,
        operator,
        value,
        filter: filter.value,
      })
    })
  })
}

function sortedQuery<T extends GenericObject>(data: T[], sortOptions?: QueryParams<T>['sort']): T[] {
  if (!sortOptions)
    return data

  const sortArray = Array.isArray(sortOptions) ? sortOptions : [sortOptions]
  return data.slice().sort((a, b) => {
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
