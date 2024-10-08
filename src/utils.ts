import type { FilterMatchMode, GenericObject, MatchModeProcessorMap, Operator } from './types'

export function getObjectProperty(object: Record<string, any>, key: string) {
  return key.split('.').reduce((o, i) => o?.[i], object)
}

export const ValueChecker = {
  string: (value: any): value is string => typeof value === 'string',
  number: (value: any): value is number => typeof value === 'number',
  boolean: (value: any): value is boolean => typeof value === 'boolean',
  strNum: (value: any): value is string | number => typeof value === 'string' || typeof value === 'number',
  strNumBool: (value: any): value is string | number | boolean => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
  strNumBoolNull: (value: any): value is string | number | boolean | null => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null,
  object: (value: any): value is GenericObject => {
    return typeof value === 'object' && value !== null
  },
}

export const MatchModeProcessor: MatchModeProcessorMap = {
  equals: ({ value, filter }) =>
    ValueChecker.strNumBoolNull(filter)
    && ValueChecker.strNumBoolNull(value)
    && filter === value,
  notEquals: ({ value, filter }) =>
    ValueChecker.strNumBoolNull(filter)
    && ValueChecker.strNumBoolNull(value)
    && filter !== value,
  exists: ({ value, filter }) => filter ? typeof value !== 'undefined' : typeof value === 'undefined',
  contains: ({ value, filter }) => value?.includes(filter),
  greaterThan: ({ value, filter, params }) => params?.dateMode ? new Date(value) > new Date(filter) : value > filter,
  greaterThanOrEqual: ({ value, filter, params }) => {
    return params?.dateMode ? new Date(value) >= new Date(filter) : value >= filter
  },
  lessThan: ({ value, filter, params }) => params?.dateMode ? new Date(value) < new Date(filter) : value < filter,
  lessThanOrEqual: ({ value, filter, params }) => {
    return params?.dateMode ? new Date(value) <= new Date(filter) : value <= filter
  },
  between: ({ value, filter, params }) => {
    return params?.dateMode ? new Date(value) >= new Date(filter[0]) && new Date(value) <= new Date(filter[1]) : value >= filter[0] && value <= filter[1]
  },
  regex: ({ value, filter, params }) =>
    typeof value === 'string' && new RegExp(filter, params?.flags ?? '').test(value),
  arrayLength: ({ value, filter }) => Array.isArray(value) && value.length === filter,
  objectMatch: ({ value, filter, params, index }) => {
    const properties = typeof index !== 'undefined' && params.matchPropertyAtIndex ? [params.properties[index]] : params.properties

    return properties[params.operator === 'AND' ? 'every' : 'some' as const](property => MatchModeProcessor[property.matchMode]({
      value: getObjectProperty(value, property.key),
      filter: getObjectProperty(filter, property.key),
      params: {} as any,
    }))
  },
}

export function validateBetweenPayload(payload: any) {
  return Array.isArray(payload) && payload.length === 2 && payload.every((i: any) => !Array.isArray(i))
}

export function parseSearchValue(value: any, caseSensitive: boolean): string {
  return (caseSensitive ? value?.toString() : value?.toString()?.toLowerCase?.()) ?? ''
}

export function processSearchQuery(params: { key: string, object: Record<string, any>, value: string, caseSensitive: boolean }): boolean {
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

export function processFilterWithLookup<
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

export function getOperator(operator?: Operator) {
  return (typeof operator === 'function' ? operator() : operator) ?? 'OR'
}

export function omit<T extends object, K extends Array<keyof T>>(object: T, keys: K) {
  const _result = { ...object }
  for (const key of keys) delete _result[key]
  return _result as Omit<T, K[number]>
}
