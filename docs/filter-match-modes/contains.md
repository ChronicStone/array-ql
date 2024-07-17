# Contains Match Mode

The 'contains' match mode checks if a string value contains the specified substring.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
]

const result = query(data, {
  filter: [
    { key: 'name', matchMode: 'contains', value: 'oh' }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John Doe', email: 'john@example.com' }
]
```

In this example, the filter returns all items where the 'name' field contains the substring 'oh'.
