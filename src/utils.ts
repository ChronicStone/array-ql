import type { GenericObject, MatchModeProcessorMap } from './types'

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
  objectStringMap: p => !!p,
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
