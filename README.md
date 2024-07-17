# Array-Query

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

> ### **Query JavaScript arrays with ORM-like syntax, benefiting from excellent type-safety & developer experience.**

## Key Features:

- 🛠 **Type-safe Querying:** Design your queries with strong typing (typed sort / search / filter keys & output)
- 📄 **Pagination:** Easily paginate through large datasets with built-in support.
- 🔎 **Full-text Search:** Perform comprehensive searches across multiple fields in your data.
- 🧭 **Advanced Filtering:** Apply complex filters with various match modes for precise data retrieval. Supports logical grouping, nested conditions, and array matching.
- 🔢 **Flexible Sorting:** Order results based on any field, with support for multiple sort criteria.
- 🚀 **Lightweight and Fast:** Queries stay super fast, even with large datasets.

## INSTALLATION

```bash
// npm
npm install @chronicstone/array-query

// yarn
yarn add @chronicstone/array-query

// pnpm
pnpm add @chronicstone/array-query

// bun
bun add @chronicstone/array-query
```

## USAGE EXAMPLE

```ts
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, fullName: 'John Doe', email: 'john@example.com', age: 30, status: 'active', roles: ['admin'], createdAt: '2023-01-01' },
  { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', age: 28, status: 'inactive', roles: ['user'], createdAt: '2023-02-15' },
  { id: 3, fullName: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'active', roles: ['user', 'manager'], createdAt: '2023-03-20' },
  // ... more users
]

const { totalRows, totalPages, rows } = query(users, {
  // Pagination
  page: 1,
  limit: 10,

  // Sorting
  sort: [
    { key: 'age', dir: 'desc' },
    { key: 'fullName', dir: 'asc' }
  ],

  // Searching
  search: {
    value: 'john',
    keys: ['fullName', 'email']
  },

  // Filtering
  filter: [
    { key: 'status', matchMode: 'equals', value: 'active' },
    { key: 'age', matchMode: 'greaterThan', value: 25 },
  ]
})
```

This example demonstrates pagination, multi-field sorting, full-text searching, and complex filtering with nested conditions and array field matching.

## License

[MIT](./LICENSE) License © 2023-PRESENT [Cyprien THAO](https://github.com/ChronicStone)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@chronicstone/array-query?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@chronicstone/array-query
[npm-downloads-src]: https://img.shields.io/npm/dm/@chronicstone/array-query?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@chronicstone/array-query
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@chronicstone/array-query?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@chronicstone/array-query
[license-src]: https://img.shields.io/github/license/ChronicStone/array-ql.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/ChronicStone/array-ql/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@chronicstone/array-query
