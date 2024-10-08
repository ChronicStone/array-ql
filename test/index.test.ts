/* eslint-disable no-console */
import { describe, expect, it } from 'vitest'
import { query } from '../src'
import { omit } from '../src/utils'
import PaginationFixtures from './fixtures/pagination.fixture.json'
import SortingFixtures from './fixtures/sorting.fixture.json'
import FilteringFixtures from './fixtures/filtering.fixture.json'
import SearchFixtures from './fixtures/search.fixture.json'

const fixtures = [
  {
    key: 'pagination',
    tests: PaginationFixtures,
  },
  {
    key: 'sorting',
    tests: SortingFixtures,
  },
  {
    key: 'search',
    tests: SearchFixtures,
  },
  {
    key: 'filtering',
    tests: FilteringFixtures,
  },
]

for (const fixture of fixtures) {
  describe(`${fixture.key} tests`, () => {
    for (const test of fixture.tests) {
      it(test.title, () => {
        const result = (query as any)(test.data, test.query)
        const matchResult = Array.isArray(result) ? { rows: result } : omit(result, ['unpaginatedRows'])
        console.log('expected', JSON.stringify(test.result, null, 2))
        console.log('actual', JSON.stringify(matchResult, null, 2))
        expect(matchResult).toEqual(test.result)
      })
    }
  })
}

describe('performance check', () => {
  const getValue = () => Math.floor(Math.random() * 100)
  const startItems = performance.now()
  const items = Array.from({ length: 1000000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: getValue(),
    other: [],
    address: { city: 'New York', country: 'USA' },
    age: Math.floor(Math.random() * 100),
  }))
  const endItems = performance.now()
  it('query 1M rows - paginate + sort + search + filter in less than 50ms', () => {
    console.info('Time taken to generate 1M items:', endItems - startItems)
    const start = performance.now()
    query(items, {
      limit: 100,
      sort: [
        { key: 'age', dir: 'asc' },
        { key: 'name', dir: 'asc' },
      ],
      search: {
        value: 'Item 1',
        keys: ['name'],
      },
      filter: [{ key: 'value', matchMode: 'greaterThan', value: 50 }],
    })

    const end = performance.now()
    console.info('Time taken to query 1M items:', end - start)
    expect(end - start).toBeLessThan(50)
  })
})
