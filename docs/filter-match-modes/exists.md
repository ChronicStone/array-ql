# Exists Match Mode

The 'exists' match mode checks if a specified field exists (or doesn't exist) in the data objects.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob', age: 35 }
]

const result = query(data, {
  filter: [
    { key: 'age', matchMode: 'exists', value: true }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', age: 25 },
  { id: 3, name: 'Bob', age: 35 }
]
```

This filter returns all items where the 'age' field exists.

To find items where a field doesn't exist:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob', age: 35 }
]

const result = query(data, {
  filter: [
    { key: 'age', matchMode: 'exists', value: false }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane' }
]
```

This filter returns all items where the 'age' field does not exist.
