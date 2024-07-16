# 🔍 ArrayQuery

ArrayQuery is a powerful TypeScript package that brings ORM-like querying capabilities to local arrays. It allows you to manipulate and retrieve data from arrays with ease, using a familiar and intuitive API.

## ✨ Features

- 📄 **Pagination**: Easily paginate through large datasets
- 🔎 **Searching**: Perform full-text search across multiple fields
- 🧭 **Filtering**: Apply complex filters with various match modes
- 🔢 **Sorting**: Order results based on any field

## 📦 Installation

```bash
npm install array-query
```

## 🚀 Quick Start

```typescript
import { query } from 'array-query'

const users = [
  { id: 1, fullName: 'John Doe', email: 'john@example.com', status: 'active', createdAt: '2023-01-01' },
  { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', status: 'inactive', createdAt: '2023-02-15' },
  // ... more users
]

const result = query(users, {
  limit: 10,
  page: 1,
  search: {
    value: 'John',
    keys: ['fullName', 'email'],
  },
  sort: {
    key: 'createdAt',
    order: 'desc',
  },
  filter: [
    {
      key: 'status',
      matchMode: 'equals',
      value: 'active',
    },
  ],
})

console.log(result.data) // Filtered and paginated user data
console.log(result.totalPages) // Total number of pages
console.log(result.totalRows) // Total number of matching rows
```

## 📘 API Reference

### `query(data: T[], params: QueryParams): QueryResult<T>`

The main function to query your array data.

#### QueryParams

- `page: number`: The page number to retrieve
- `limit: number`: The number of items per page
- `sort?: { key: string, order?: 'asc' | 'desc' }`: Sorting configuration
- `search?: { value: string, keys: string[] }`: Search configuration
- `filter?: QueryFilter[]`: Array of filters to apply

#### QueryFilter

- `key: string`: The property to filter on
- `value: any`: The value to compare against
- `matchMode: FilterMatchMode`: The type of comparison to make
- `operator?: Operator` (`'AND' | 'OR' | (() => 'AND' | 'OR')`): How to combine multiple matches in arrays
- `params?: MatcherParams`: Additional parameters for the match mode

### FilterMatchMode

- `'contains'`: Check if the value contains the filter value
- `'between'`: Check if the value is between two values (for numbers or dates)
- `'equals'`: Exact match
- `'notEquals'`: Inverse of exact match
- `'greaterThan'`: Greater than comparison
- `'greaterThanOrEqual'`: Greater than or equal comparison
- `'lessThan'`: Less than comparison
- `'lessThanOrEqual'`: Less than or equal comparison
- `'exists'`: Check if the property exists
- `'objectStringMap'`: Complex object mapping
- `'arrayLength'`: Check the length of an array
- `'objectMatch'`: Complex object matching

## 🌟 Advanced Usage

### Complex Filtering

```typescript
const result = query(users, {
  filter: [
    {
      key: 'account.type',
      matchMode: 'equals',
      value: ['admin', 'manager'],
    },
    {
      key: 'lastLogin',
      matchMode: 'greaterThan',
      value: '2023-01-01',
      params: { dateMode: true },
    },
    {
      key: 'tags',
      matchMode: 'arrayLength',
      value: 3,
    },
  ],
})
```

### Object Map Filtering

```typescript
const result = query(users, {
  filter: [
    {
      key: 'account',
      matchMode: 'objectMatch',
      params: {
        properties: [{ key: 'type', matchMode: 'equals' }, { key: 'id', matchMode: 'equals' }],
        operator: 'AND',
      },
      value: {
        type: 'admin',
        id: 1,
      },
    },
  ],
})
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/array-query/issues).

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.
