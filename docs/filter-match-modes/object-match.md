# Object Match Mode

The 'objectMatch' mode provides powerful nested object filtering capabilities, including the ability to filter arrays of objects.

## Basic Usage

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', account: { type: 'premium', status: 'active', details: { level: 3 } } },
  { id: 2, name: 'Jane', account: { type: 'basic', status: 'inactive', details: { level: 1 } } },
  { id: 3, name: 'Bob', account: { type: 'premium', status: 'inactive', details: { level: 2 } } }
]

const result = query(data, {
  filter: [
    {
      key: 'account',
      matchMode: 'objectMatch',
      value: { type: 'premium', status: 'active' },
      params: {
        operator: 'AND',
        properties: [
          { key: 'type', matchMode: 'equals' },
          { key: 'status', matchMode: 'equals' }
        ]
      }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', account: { type: 'premium', status: 'active', details: { level: 3 } } }
]
```

This example demonstrates the basic usage. It filters objects where the 'account' has both 'type' equal to 'premium' AND 'status' equal to 'active'.

## Using Different Match Modes

You can use different match modes for each property:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', account: { type: 'premium', status: 'active', details: { level: 3 } } },
  { id: 2, name: 'Jane', account: { type: 'basic', status: 'inactive', details: { level: 1 } } },
  { id: 3, name: 'Bob', account: { type: 'premium', status: 'inactive', details: { level: 2 } } }
]

const result = query(data, {
  filter: [
    {
      key: 'account',
      matchMode: 'objectMatch',
      value: { type: 'premium', details: { level: 2 } },
      params: {
        operator: 'AND',
        properties: [
          { key: 'type', matchMode: 'equals' },
          { key: 'details.level', matchMode: 'greaterThan' }
        ]
      }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', account: { type: 'premium', status: 'active', details: { level: 3 } } }
]
```

This example uses 'equals' for 'type' and 'greaterThan' for 'details.level'.

## Filtering Arrays of Objects

### Case 1: ALL objects in the array match ALL conditions

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', orders: [{ id: 1, total: 100 }, { id: 2, total: 200 }] },
  { id: 2, name: 'Jane', orders: [{ id: 3, total: 150 }, { id: 4, total: 300 }] },
  { id: 3, name: 'Bob', orders: [{ id: 5, total: 50 }, { id: 6, total: 250 }] }
]

const result = query(data, {
  filter: [
    {
      key: 'orders',
      matchMode: 'objectMatch',
      value: { total: 50 },
      operator: 'AND',
      params: {
        operator: 'AND',
        properties: [
          { key: 'total', matchMode: 'greaterThan' }
        ]
      }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', orders: [{ id: 1, total: 100 }, { id: 2, total: 200 }] },
  { id: 2, name: 'Jane', orders: [{ id: 3, total: 150 }, { id: 4, total: 300 }] }
]
```

This example returns items where ALL orders have a total greater than 50.

### Case 2: ALL objects in the array match SOME of the conditions

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', orders: [{ id: 1, total: 100, status: 'completed' }, { id: 2, total: 200, status: 'pending' }] },
  { id: 2, name: 'Jane', orders: [{ id: 3, total: 150, status: 'completed' }, { id: 4, total: 300, status: 'completed' }] },
  { id: 3, name: 'Bob', orders: [{ id: 5, total: 50, status: 'pending' }, { id: 6, total: 250, status: 'completed' }] }
]

const result = query(data, {
  filter: [
    {
      key: 'orders',
      matchMode: 'objectMatch',
      value: { total: 100, status: 'completed' },
      operator: 'AND',
      params: {
        operator: 'OR',
        properties: [
          { key: 'total', matchMode: 'greaterThan' },
          { key: 'status', matchMode: 'equals' }
        ]
      }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', orders: [{ id: 1, total: 100, status: 'completed' }, { id: 2, total: 200, status: 'pending' }] },
  { id: 2, name: 'Jane', orders: [{ id: 3, total: 150, status: 'completed' }, { id: 4, total: 300, status: 'completed' }] }
]
```

This example returns items where ALL orders either have a total greater than 100 OR have a status of 'completed'.

### Case 3: SOME objects in the array match ALL conditions

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', orders: [{ id: 1, total: 100, status: 'completed' }, { id: 2, total: 200, status: 'pending' }] },
  { id: 2, name: 'Jane', orders: [{ id: 3, total: 150, status: 'completed' }, { id: 4, total: 300, status: 'completed' }] },
  { id: 3, name: 'Bob', orders: [{ id: 5, total: 50, status: 'pending' }, { id: 6, total: 250, status: 'completed' }] }
]

const result = query(data, {
  filter: [
    {
      key: 'orders',
      matchMode: 'objectMatch',
      value: { total: 200, status: 'completed' },
      operator: 'OR',
      params: {
        operator: 'AND',
        properties: [
          { key: 'total', matchMode: 'greaterThan' },
          { key: 'status', matchMode: 'equals' }
        ]
      }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane', orders: [{ id: 3, total: 150, status: 'completed' }, { id: 4, total: 300, status: 'completed' }] }
]
```

This example returns items where at least one order has a total greater than 200 AND a status of 'completed'.

## Using applyAtRoot

The `applyAtRoot` option allows you to apply the filter to the root object instead of a nested property:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', age: 30, status: 'active' },
  { id: 2, name: 'Jane', age: 25, status: 'inactive' },
  { id: 3, name: 'Bob', age: 35, status: 'active' }
]

const result = query(data, {
  filter: [
    {
      key: '',
      matchMode: 'objectMatch',
      value: { age: 30, status: 'active' },
      params: {
        operator: 'AND',
        properties: [
          { key: 'age', matchMode: 'greaterThanOrEqual' },
          { key: 'status', matchMode: 'equals' }
        ],
        applyAtRoot: true
      }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', age: 30, status: 'active' },
  { id: 3, name: 'Bob', age: 35, status: 'active' }
]
```

This example applies the filter directly to the root objects in the array, matching those with age >= 30 and status 'active'.
