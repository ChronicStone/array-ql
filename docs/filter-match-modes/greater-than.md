# Greater Than Match Mode

The 'greaterThan' match mode checks if a numeric or date value is greater than the specified value.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
]

const result = query(data, {
  filter: [
    { key: 'age', matchMode: 'greaterThan', value: 28 }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
]
```

This filter returns all items where the 'age' is greater than 28.

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
      matchMode: 'greaterThan',
      value: '2023-06-01',
      params: { dateMode: true }
    }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane', joinDate: '2023-06-20' },
  { id: 3, name: 'Bob', joinDate: '2023-12-05' }
]
```

This filter returns all items where the 'joinDate' is after June 1, 2023.
