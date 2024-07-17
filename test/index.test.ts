import { describe, expect, it } from 'vitest'
import { query } from '../src'
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
        const { unpaginatedRows, ...result } = (query as any)(test.data, test.query)
        expect(result).toEqual(test.result)
      })
    }
  })
}

describe('performance check', () => {
  // VAL BETWEEN 1 & 100
  const getValue = () => Math.floor(Math.random() * 100)
  const items = Array.from({ length: 1000000 }, (_, i) => ({ id: i, name: `Item ${i}`, value: getValue() }))
  it('query 1M rows - paginate + sort + search + filter in less than 500ms', () => {
    const start = performance.now()
    query(items, {
      limit: 10,
      sort: {
        key: 'id',
        dir: 'asc',
      },
      search: {
        value: 'Item 1',
        keys: ['name'],
      },
      filter: [{ key: 'value', matchMode: 'greaterThan', value: 50 }],
    })

    const end = performance.now()
    // eslint-disable-next-line no-console
    console.info('Time taken:', end - start)
    expect(end - start).toBeLessThan(500)
  })
})
