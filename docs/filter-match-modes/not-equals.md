# Not Equals Match Mode

The 'notEquals' match mode checks for inequality between the field value and the specified value.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', status: 'active' },
  { id: 2, name: 'Jane', status: 'inactive' },
  { id: 3, name: 'Bob', status: 'active' }
]

const result = query(data, {
  filter: [
    { key: 'status', matchMode: 'notEquals', value: 'active' }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane', status: 'inactive' }
]
```

This filter returns all items where the 'status' is not equal to 'active'.
