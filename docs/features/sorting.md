# Sorting

ArrayQuery provides a flexible sorting capability that allows you to order your data based on one or multiple fields. This feature is crucial for organizing and presenting data in a meaningful way.

## How Sorting Works

The sort feature in ArrayQuery operates based on the `SortOptions` interface:

```ts twoslash
interface SortOptions {
  key: string
  dir: 'asc' | 'desc'
}
```

- `key`: The field name to sort by
- `dir`: The sort direction ('asc' for ascending, 'desc' for descending)

You can provide either a single `SortOptions` object or an array of `SortOptions` to sort by multiple fields.

## Basic Usage

Here's a simple example of how to use the sort feature with ArrayQuery:

```ts twoslash
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 },
  { id: 3, name: 'Bob Johnson', age: 35 }
]

const result = query(users, {
  sort: { key: 'age', dir: 'asc' }
})
```

This query will return the following result:

```ts twoslash
[
  { id: 2, name: 'Jane Smith', age: 25 },
  { id: 1, name: 'John Doe', age: 30 },
  { id: 3, name: 'Bob Johnson', age: 35 }
]
```

## Multi-Field Sorting

ArrayQuery supports sorting by multiple fields. The sort options are applied in the order they are provided:

```ts twoslash
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 },
  { id: 3, name: 'Martin Sam', age: 35 },
  { id: 4, name: 'Bob Johnson', age: 35 },
  { id: 5, name: 'Robert John', age: 28 },
  { id: 6, name: 'Alice Williams', age: 28 },
  { id: 7, name: 'Emma Jones', age: 32 }
]

const result = query(users, {
  sort: [
    { key: 'age', dir: 'asc' },
    { key: 'name', dir: 'asc' }
  ]
})
```

This will return:

```ts twoslash
[
  { id: 2, name: 'Jane Smith', age: 25 },
  { id: 6, name: 'Alice Williams', age: 28 },
  { id: 5, name: 'Robert John', age: 28 },
  { id: 1, name: 'John Doe', age: 30 },
  { id: 7, name: 'Emma Jones', age: 32 },
  { id: 4, name: 'Bob Johnson', age: 35 },
  { id: 3, name: 'Martin Sam', age: 35 }
]
```

In this example, the data is first sorted by age in ascending order. For entries with the same age, it then sorts by name in ascending order.

## Sorting Nested Fields

You can sort by nested fields using dot notation:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', scores: { math: 85, science: 92 } },
  { id: 2, name: 'Jane', scores: { math: 90, science: 88 } },
  { id: 3, name: 'Bob', scores: { math: 78, science: 95 } }
]

const result = query(data, {
  sort: { key: 'scores.math', dir: 'desc' }
})
```

This will sort the data based on the math scores in descending order.
