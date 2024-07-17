# Pagination

Pagination is a crucial feature when dealing with large datasets. ArrayQuery provides an easy-to-use pagination system that allows you to efficiently retrieve subsets of your data.

## How Pagination Works

ArrayQuery's pagination system operates based on two main parameters:

1. `page`: The current page number (1-indexed)
2. `limit`: The number of items per page

When you apply pagination to your query, ArrayQuery will return the specified subset of data along with metadata about the pagination results.

## Basic Usage

Here's a simple example of how to use pagination with ArrayQuery:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
  { id: 6, name: 'Item 6' },
  { id: 7, name: 'Item 7' },
  { id: 8, name: 'Item 8' },
  { id: 9, name: 'Item 9' },
  { id: 10, name: 'Item 10' },
]

const result = query(data, {
  page: 1,
  limit: 5
})
```

This query will return the following result:

## Understanding the Result

The outout of query is different with and without pagination. When pagination is applied, the result will be an object with the following properties:

- `rows: T[]`: An array containing the items for the requested page
- `unpaginatedRows: T[]`: An array containing the items for the entire dataset, with filter / sort .. without pagination
- `totalPages`: The total number of pages based on the dataset size and the limit
- `totalRows`: The total number of rows in the entire dataset

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
]

const result = query(data, {
  page: 2,
  limit: 2
})

console.log(result)
// HOVER result TO SEE OUTPUT TYPE
```

When pagination is not applied, the result will be an an object with the following properties:

- `rows: T[]`: An array containing the items for the entire dataset

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
]

const result = query(data, {})
// HOVER result TO SEE OUTPUT TYPE
```
