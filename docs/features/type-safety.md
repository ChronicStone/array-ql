# Type-Safe Queries

ArrayQuery provides type safety for query parameters, ensuring that you can only use valid keys for sorting, searching, and filtering. This feature helps catch errors at compile-time and provides excellent autocompletion support in your IDE.

## Sorting

When specifying the `key` for sorting, you'll get type-safe suggestions based on the properties of your data:

```ts twoslash
// @noErrors
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' },
]

const result = query(users, {
  sort: { key: '' }
//              ^|
})
```

Hovering over the empty string will show a popover with valid options: `"id" | "name" | "age" | "email"`.

## Searching

The `keys` array in the search options is also type-safe:

```ts twoslash
// @noErrors
import { query } from '@chronicstone/array-query'

const products = [
  { id: 1, name: 'Laptop', price: 1000, description: 'Powerful laptop' },
  { id: 2, name: 'Phone', price: 500, description: 'Smart phone' },
]

const result = query(products, {
  search: {
    value: 'laptop',
    keys: ['']
    //      ^|
  }
})
```

The popover for the empty string will show: `"id" | "name" | "price" | "description"`.

## Filtering

Filter keys are also type-safe, including for nested properties:

```ts twoslash
// @noErrors
import { query } from '@chronicstone/array-query'

const employees = [
  { id: 1, name: 'Alice', department: { name: 'IT', location: 'New York' } },
  { id: 2, name: 'Bob', department: { name: 'HR', location: 'London' } },
]

const result = query(employees, {
  filter: [
    { key: '' }
    //      ^|
  ]
})
```

## Complex Nested Structures

ArrayQuery handles complex nested structures with ease:

```typescript twoslash
// @noErrors
import { query } from '@chronicstone/array-query'

const data = [
  {
    id: 1,
    info: {
      personal: { name: 'Alice', age: 30 },
      professional: { title: 'Developer', skills: ['JavaScript', 'TypeScript'] }
    },
    contacts: [
      { type: 'email', value: 'alice@example.com' },
      { type: 'phone', value: '123-456-7890' }
    ]
  }
]

const result = query(data, {
  sort: { key: '', dir: 'asc' },
//              ^|
})
```

These type-safe queries ensure that you're always using valid property paths, reducing errors and improving the developer experience when working with ArrayQuery.
