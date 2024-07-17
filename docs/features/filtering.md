# Filtering

ArrayQuery provides a powerful and flexible filtering engine that allows you to apply complex conditions to your data. The filtering system supports a wide range of match modes, nested conditions, and logical grouping with built-in array handling.

## Filter Structure

Filters in ArrayQuery can be either an array of individual filter conditions or an array of filter groups. Here's the updated filter structure:

```ts
export type FilterOptions = Array<QueryFilterGroup> | Array<QueryFilter>

interface QueryFilter {
  key: string
  value: any
  operator?: Operator
  matchMode: FilterMatchMode
  params?: ComparatorParams | ObjectMapFilterParams
}

interface QueryFilterGroup {
  operator: Operator
  filters: QueryFilter[]
}

type Operator = 'AND' | 'OR' | (() => 'AND' | 'OR')
```

## Basic Usage

Here's a simple example of how to use the filter feature with ArrayQuery:

```ts twoslash
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'John Doe', age: 30, roles: ['admin', 'user'] },
  { id: 2, name: 'Jane Smith', age: 25, roles: ['user'] },
  { id: 3, name: 'Bob Johnson', age: 35, roles: ['manager', 'user'] }
]

const result = query(users, {
  filter: [
    { key: 'age', matchMode: 'greaterThan', value: 25 }
  ]
})
```

This query will return users older than 25.

## Advanced Filtering

ArrayQuery supports complex filtering scenarios, including logical groups and built-in array handling.

### Multiple Conditions with Regular Filters

When you use an array of regular filters, all conditions must be met for a row to be included in the result:

```ts twoslash
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'John Doe', age: 30, roles: ['admin', 'user'] },
  { id: 2, name: 'Jane Smith', age: 25, roles: ['user'] },
  { id: 3, name: 'Bob Johnson', age: 35, roles: ['manager', 'user'] }
]

const result = query(users, {
  filter: [
    { key: 'age', matchMode: 'greaterThan', value: 25 },
    { key: 'name', matchMode: 'contains', value: 'John' }
  ]
})
```

This query will return users who are older than 25 AND have 'John' in their name.

### Logical Groups

You can use filter groups to create more complex conditions. When using filter groups, a row will be included if it matches at least one of the groups:

```ts twoslash
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'John Doe', age: 30, roles: ['admin', 'user'] },
  { id: 2, name: 'Jane Smith', age: 25, roles: ['user'] },
  { id: 3, name: 'Bob Johnson', age: 35, roles: ['manager', 'user'] },
  { id: 4, name: 'Alice Williams', age: 65, roles: ['user'] }
]

const result = query(users, {
  filter: [
    {
      operator: 'AND',
      filters: [
        { key: 'age', matchMode: 'greaterThan', value: 18 },
        { key: 'age', matchMode: 'lessThan', value: 45 }
      ]
    },
    {
      operator: 'AND',
      filters: [
        { key: 'age', matchMode: 'greaterThan', value: 60 },
        { key: 'age', matchMode: 'lessThan', value: 90 }
      ]
    }
  ]
})
```

This example filters users who are either between 18 and 45 years old, OR between 60 and 90 years old. The row will be included if it matches either of these groups.

### Built-in Array Handling

ArrayQuery automatically handles array values in the data. When a filter is applied to a field that contains an array, the filter condition is checked against each element of the array:

```ts twoslash
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'John Doe', age: 30, roles: ['admin', 'user'] },
  { id: 2, name: 'Jane Smith', age: 25, roles: ['user'] },
  { id: 3, name: 'Bob Johnson', age: 35, roles: ['manager', 'user'] }
]

const result = query(users, {
  filter: [
    {
      key: 'roles',
      matchMode: 'equals',
      value: 'admin',
      operator: 'OR'
    }
  ]
})
```

In this example:
- For a user with `roles: ['admin', 'manager']`, the filter will return true because at least one element ("admin") matches the condition.
- The `operator: "OR"` means that if any element in the array matches, the condition is considered true.
- If `operator: "AND"` was used, all elements in the array would need to match the condition.

### Nested Object Filtering

You can filter based on nested object properties using dot notation:

```ts twoslash
import { query } from '@chronicstone/array-query'

const users = [
  { id: 1, name: 'John Doe', age: 30, address: { city: 'New York', country: 'USA' } },
  { id: 2, name: 'Jane Smith', age: 25, address: { city: 'London', country: 'UK' } },
  { id: 3, name: 'Bob Johnson', age: 35, address: { city: 'Paris', country: 'France' } }
]

const result = query(users, {
  filter: [
    { key: 'address.city', matchMode: 'equals', value: 'New York' }
  ]
})
```

## Match Modes

ArrayQuery supports various match modes for different types of comparisons. Each match mode has its own dedicated documentation page for detailed usage. The available match modes include:

- 'contains'
- 'between'
- 'equals'
- 'notEquals'
- 'greaterThan'
- 'greaterThanOrEqual'
- 'lessThan'
- 'lessThanOrEqual'
- 'exists'
- 'arrayLength'
- 'regex'
- 'objectMatch'
