# Equals Match Mode

The 'equals' match mode checks for exact equality between the field value and the specified value.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', status: 'active' },
  { id: 2, name: 'Jane', status: 'inactive' },
  { id: 3, name: 'Bob', status: 'active' }
]

const result = query(data, {
  filter: [
    { key: 'status', matchMode: 'equals', value: 'active' }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', status: 'active' },
  { id: 3, name: 'Bob', status: 'active' }
]
```

This filter returns all items where the 'status' is exactly equal to 'active'.
