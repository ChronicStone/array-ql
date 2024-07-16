import { describe, expect, it } from 'vitest'
import { query } from '../src'
import { generateUsers } from './fixtures/user.fixture'

describe('should filter users', () => {
  const users = generateUsers(100)
  const activeUsers = users.filter(user => user.status === 'active')
  it('should filter active users', () => {
    const { totalPages, totalRows } = query(users, {
      limit: 10,
      sort: {
        key: 'createdAt',
        dir: 'desc',
      },
      filter: [
        {
          key: 'status',
          matchMode: 'equals',
          value: 'active',
        },
      ],
    })

    expect(totalRows).toEqual(activeUsers.length)
    expect(totalPages).toEqual(Math.ceil(activeUsers.length / 10))
  })
})
