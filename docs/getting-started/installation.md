# Installation

Installing ArrayQuery in your project is straightforward. You can use your preferred package manager to add it to your dependencies.

## Installing ArrayQuery

Choose your preferred package manager from the options below:

::: code-group
```sh [npm]
npm install @chronicstone/array-query
```

```sh [yarn]
yarn add @chronicstone/array-query
```

```sh [pnpm]
pnpm add @chronicstone/array-query
```

```sh [bun]
bun add @chronicstone/array-query
```
:::

## Importing ArrayQuery

Once installed, you can import the `query` function from ArrayQuery in your TypeScript or JavaScript files:

```ts twoslash
import { query } from '@chronicstone/array-query'
```

The package also exports all its types :

```ts twoslash
import type { FilterMatchMode, QueryFilter, QueryParams } from '@chronicstone/array-query'
```

## Use the library

You can now use the `query` function to perform various operations on your array data.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 },
  { id: 3, name: 'Bob Johnson', age: 35 }
]

const result = query(data, {
  limit: 10,
  sort: { key: 'age', order: 'asc' },
})
```
