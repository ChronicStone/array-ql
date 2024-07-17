# Between Match Mode

The 'between' match mode checks if a numeric or date value is within a specified range.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
]

const result = query(data, {
  filter: [
    { key: 'age', matchMode: 'between', value: [28, 32] }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane', age: 30 }
]
```

This filter returns all items where the 'age' is between 28 and 32 (inclusive).

For date comparisons, you can use the `dateMode` parameter:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane', joinDate: '2023-06-20' },
  { id: 3, name: 'Bob', joinDate: '2023-12-05' }
]

const result = query(data, {
  filter: [
    {
      key: 'joinDate',
      matchMode: 'between',
      value: ['2023-05-01', '2023-08-31'],
      params: { dateMode: true }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane', joinDate: '2023-06-20' }
]
```

This filter returns all items where the 'joinDate' is between May 1, 2023 and August 31, 2023.
