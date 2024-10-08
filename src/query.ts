import type { FilterOptions, GenericObject, QueryFilter, QueryFilterGroup, QueryParams, QueryResult } from './types'
import { getObjectProperty, getOperator, processFilterWithLookup, processSearchQuery } from './utils'

export function query<T extends GenericObject, P extends QueryParams<T>>(
  data: T[],
  params: P,
): QueryResult<T, P> {
  let result = lazyQuery(data, params)
  result = lazySortedQuery(result, params.sort)
  return paginateQuery(result, params)
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

function matchesFilters<T extends GenericObject>(item: T, filters?: FilterOptions): boolean {
  const _filters = (typeof filters === 'object' && ('groups' in filters) ? filters.groups : filters) ?? []
  if (!_filters || _filters.length === 0)
    return true
  const isGroup = _filters.every(filter => 'filters' in filter)
  const groupOperator = getOperator(typeof filters === 'object' && 'operator' in filters ? filters.operator : 'OR')
  const method = isGroup ? (groupOperator === 'AND' ? 'every' : 'some') : 'every'
  return _filters.filter(filter => filter.condition?.() ?? true)[method]((group: QueryFilter | QueryFilterGroup) => {
    const groupFilters = 'filters' in group ? group.filters : [group]
    const op = 'filters' in group ? group.operator : 'OR'
    return groupFilters.filter(filter => filter.condition?.() ?? true)[op === 'AND' ? 'every' : 'some']((filter: QueryFilter) => {
      const value = getObjectProperty(item, filter.key)
      const operator = getOperator(filter.operator)
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

function* lazySortedQuery<T extends GenericObject>(
  data: Iterable<T>,
  sortOptions?: QueryParams<T>['sort'],
): Generator<T, void, undefined> {
  if (!sortOptions) {
    yield * data
    return
  }

  const sortArray = Array.isArray(sortOptions) ? sortOptions : [sortOptions]
  const buffer: T[] = []
  const compare = (a: T, b: T) => {
    for (const { key, dir, parser } of sortArray) {
      const parserHandler = typeof parser === 'function'
        ? parser
        : (v: any) =>
            parser === 'number'
              ? Number(v)
              : parser === 'boolean'
                ? Boolean(v)
                : parser === 'string' ? String(v) : v
      const aParsed = parserHandler(getObjectProperty(a, key)) ?? null
      const bParsed = parserHandler(getObjectProperty(b, key)) ?? null
      if (aParsed !== bParsed) {
        const comparison = (aParsed < bParsed) ? -1 : 1
        return dir === 'asc' ? comparison : -comparison
      }
    }
    return 0
  }

  for (const item of data) {
    buffer.push(item)
    if (buffer.length >= 1000)
      break
  }

  buffer.sort(compare)

  while (buffer.length > 0) {
    yield buffer[0]
    buffer.shift()

    for (const item of data) {
      let insertIndex = buffer.findIndex(bufferItem => compare(item, bufferItem) < 0)
      if (insertIndex === -1) {
        insertIndex = buffer.length
      }
      buffer.splice(insertIndex, 0, item)
      if (buffer.length >= 1000)
        break
    }
  }
}

function paginateQuery<T extends GenericObject, P extends QueryParams<T>>(data: Iterable<T>, params: P): QueryResult<T, P> {
  if (typeof params.limit === 'undefined') {
    return Array.from(data) as QueryResult<T, P>
  }

  else {
    let rows = Array.from(data)
    const totalRows = rows.length
    const totalPages = Math.ceil(totalRows / params.limit)
    const start = ((params?.page ?? 1) - 1) * params.limit
    const end = start + params.limit
    rows = rows.slice(start, end)

    return {
      totalRows,
      totalPages,
      rows,
      get unpaginatedRows() {
        return Array.from(data)
      },
    } as QueryResult<T, P>
  }
}
