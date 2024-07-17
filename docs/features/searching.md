# Searching

ArrayQuery provides a powerful searching capability that allows you to perform full-text searches across multiple fields in your data, including deeply nested fields and array fields.

## How Searching Works

The search feature in ArrayQuery operates based on the `SearchOptions` interface:

```ts twoslash
interface SearchOptions {
  value: string
  keys: string[] | Array<{ key: string, caseSensitive?: boolean }>
  caseSensitive?: boolean
}
```

- `value`: The search term or phrase
- `keys`: An array of field names to search within, or an array of objects specifying the key and case sensitivity for each field
- `caseSensitive`: A global flag to set case sensitivity for all fields (optional)

When you apply a search to your query, ArrayQuery will return all items where the specified fields contain the search value.

## Basic Usage

Here's a simple example of how to use the search feature with ArrayQuery:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, title: 'iPhone 12', description: 'Latest Apple smartphone' },
  { id: 2, title: 'Samsung Galaxy S21', description: 'Flagship Android device' },
  { id: 3, title: 'Google Pixel 5', description: 'Pure Android experience' },
  { id: 4, title: 'OnePlus 9', description: 'Flagship killer smartphone' }
]

const result = query(data, {
  search: {
    value: 'android',
    keys: ['title', 'description']
  }
})
```

This query will return the following result:

```ts
[
  { id: 2, title: 'Samsung Galaxy S21', description: 'Flagship Android device' },
  { id: 3, title: 'Google Pixel 5', description: 'Pure Android experience' }
]
```

## Case Sensitivity

You can control case sensitivity in two ways:

1. Globally for all fields:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, title: 'iPhone 12', description: 'Latest Apple smartphone' },
  { id: 2, title: 'Samsung Galaxy S21', description: 'Flagship Android device' },
  { id: 3, title: 'Google Pixel 5', description: 'Pure Android experience' },
  { id: 4, title: 'OnePlus 9', description: 'Flagship killer smartphone' }
]

const result = query(data, {
  search: {
    value: 'Android',
    keys: ['title', 'description'],
    caseSensitive: true
  }
})
```

2. Per field:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, title: 'iPhone 12', description: 'Latest Apple smartphone' },
  { id: 2, title: 'Samsung Galaxy S21', description: 'Flagship Android device' },
  { id: 3, title: 'Google Pixel 5', description: 'Pure Android experience' },
  { id: 4, title: 'OnePlus 9', description: 'Flagship killer smartphone' }
]

const result = query(data, {
  search: {
    value: 'Android',
    keys: [
      { key: 'title', caseSensitive: true },
      { key: 'description' }
    ]
  }
})
```

In the second example, the search will be case-sensitive for the 'title' field but case-insensitive for the 'description' field.

## Searching Deeply Nested Fields

ArrayQuery supports searching in deeply nested fields using dot notation:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  {
    id: 1,
    name: 'John Doe',
    contact: {
      email: 'john@example.com',
      address: {
        city: 'New York',
        country: 'USA'
      }
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    contact: {
      email: 'jane@example.com',
      address: {
        city: 'London',
        country: 'UK'
      }
    }
  }
]

const result = query(data, {
  search: {
    value: 'New York',
    keys: ['contact.address.city']
  }
})
```

This will return all items where the city in the nested address object matches 'New York'.

## Searching Array Fields

ArrayQuery can also search within array fields:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John Doe', tags: ['developer', 'javascript', 'typescript'] },
  { id: 2, name: 'Jane Smith', tags: ['designer', 'ui', 'ux'] },
  { id: 3, name: 'Bob Johnson', tags: ['manager', 'agile', 'scrum'] }
]

const result = query(data, {
  search: {
    value: 'script',
    keys: ['tags']
  }
})
```

This will return all items where any of the tags contain 'script', matching both 'javascript' and 'typescript' in this case.
