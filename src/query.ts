import type { FilterMatchMode, GenericObject, MatchModeProcessorMap, QueryParams, QueryResult } from './types'
import { MatchModeProcessor, getObjectProperty, validateBetweenPayload } from './utils'

export function query<T extends GenericObject, P extends QueryParams>(
  data: T[],
  params: P,
): QueryResult<T, P> {
  let result: T[] = [...data]

  if (params.search?.value) {
    result = result.filter((item) => {
      for (const key of params.search?.keys ?? []) {
        if (processSearchQuery({ key, object: item, value: params.search?.value as string }))
          return true
      }
      return false
    })
  }

  if (params.sort?.key) {
    result = result.sort((a, b) => {
      const aValue = getObjectProperty(a, params.sort?.key ?? '')
      const bValue = getObjectProperty(b, params.sort?.key ?? '')
      if (aValue === bValue)
        return 0
      if (aValue > bValue)
        return params.sort?.dir === 'asc' ? 1 : -1
      if (aValue < bValue)
        return params.sort?.dir === 'asc' ? -1 : 1
      return 0
    })
  }

  if (Array.isArray(params.filter) && params.filter.length) {
    result = result.filter((item) => {
      return (params.filter ?? []).every((filter) => {
        const value = getObjectProperty(item, filter.key)
        const arrayLookup = typeof filter.arrayLookup === 'function' ? filter.arrayLookup() : filter.arrayLookup ?? 'OR'
        if (filter.matchMode === 'equals') {
          return processFilterWithLookup({
            type: 'equals',
            params: null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'contains') {
          return processFilterWithLookup({
            type: 'contains',
            params: null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }
        if (filter.matchMode === 'between') {
          return processFilterWithLookup({
            type: 'between',
            params: filter?.params ?? null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'greaterThan') {
          return processFilterWithLookup({
            type: 'greaterThan',
            params: filter?.params ?? null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'greaterThanOrEqual') {
          return processFilterWithLookup({
            type: 'greaterThanOrEqual',
            params: filter?.params ?? null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'lessThan') {
          return processFilterWithLookup({
            type: 'lessThan',
            params: filter?.params ?? null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'lessThanOrEqual') {
          return processFilterWithLookup({
            type: 'lessThanOrEqual',
            params: filter?.params ?? null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'exists') {
          return processFilterWithLookup({
            type: 'exists',
            params: null,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'objectStringMap') {
          return processFilterWithLookup({
            type: 'objectStringMap',
            params: filter.params,
            arrayLookup,
            value,
            filter: filter.value,
          })
        }

        if (filter.matchMode === 'arrayLength') {
          return processFilterWithLookup({
            type: 'arrayLength',
            params: null,
            arrayLookup,
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
            arrayLookup,
            value: filter.lookupAtRoot ? item : value,
            filter: filterValue,
          })
        }

        return false
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
    const start = params.offset ?? 0
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

function processSearchQuery(params: { key: string, object: Record<string, any>, value: string }): boolean {
  const { key, object, value } = params
  const keys = key.split('.')

  let current: any = object
  for (let i = 0; i < keys.length; i++) {
    if (Array.isArray(current))
      return current.some(item => processSearchQuery({ key: keys.slice(i).join('.'), object: item, value }))

    else if (current && Object.prototype.hasOwnProperty.call(current, keys[i]))
      current = current[keys[i]]

    else
      return false
  }

  if (Array.isArray(current))
    return current.some(element => element.toString().toLowerCase().includes(value.toLowerCase()))

  else
    return current?.toString().toLowerCase().includes(value.toLowerCase()) ?? false
}

function processFilterWithLookup<
  T extends FilterMatchMode,
  P = Parameters<MatchModeProcessorMap[T]>[0],
>(params: {
  type: FilterMatchMode
  arrayLookup: 'AND' | 'OR'
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

  else if (params.arrayLookup === 'AND') {
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

  else if (params.arrayLookup === 'OR') {
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
