# Regex Match Mode

The regex match mode allows you to filter data using regular expressions. This powerful feature enables complex pattern matching across your dataset.

## Basic Usage

To use the regex match mode, set the `matchMode` to `'regex'` in your filter configuration:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, email: 'john@example.com' },
  { id: 2, email: 'jane@test.com' },
  { id: 3, email: 'bob@example.org' }
]

const result = query(data, {
  filter: [
    { key: 'email', matchMode: 'regex', value: '@example\\.(com|org)' }
  ]
})
```

This query will return all items where the email matches the pattern `@example.com` or `@example.org`.

## Flags

You can modify the behavior of the regex matching by providing flags. Flags are specified using the `params` option:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'jane smith' },
  { id: 3, name: 'Bob Johnson' }
]

const result = query(data, {
  filter: [
    {
      key: 'name',
      matchMode: 'regex',
      value: '^j.*',
      params: { flags: 'i' }
    }
  ]
})
```

## Raw RegExp

Instead of defining the regex pattern as a string, you can also pass a regular expression object directly:

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'jane smith' },
  { id: 3, name: 'Bob Johnson' }
]

const result = query(data, {
  filter: [
    {
      key: 'name',
      matchMode: 'regex',
      value: /^j.*/i
    }
  ]
})
```

For a detailed explanation of available flags and their usage, please refer to the [MDN documentation on Regular Expression Flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags).

## Examples

### Case-insensitive Matching

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'jane smith' },
  { id: 3, name: 'Bob Johnson' }
]

const result = query(data, {
  filter: [
    {
      key: 'name',
      matchMode: 'regex',
      value: '^j.*',
      params: { flags: 'i' }
    }
  ]
})
```

This will match both "John Doe" and "jane smith".

### Multi-line Matching

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, description: 'First line\nSecond line' },
  { id: 2, description: 'One line only' },
  { id: 3, description: 'First line\nLast line' }
]

const result = query(data, {
  filter: [
    {
      key: 'description',
      matchMode: 'regex',
      value: '^Last',
      params: { flags: 'm' }
    }
  ]
})
```

This will match the item with id 3, where "Last" appears at the start of a line.

## Combining with Other Filters

You can combine regex filters with other filter types:

```typescript
const result = query(data, {
  filter: [
    {
      key: 'name',
      matchMode: 'regex',
      value: '^j.*',
      params: { flags: 'i' }
    },
    { key: 'age', matchMode: 'greaterThan', value: 28 }
  ]
})
```

This will find items where the name starts with 'j' (case-insensitive) AND the age is greater than 28.

## Performance Considerations

While regex matching is powerful, it can be computationally expensive, especially on large datasets or with complex patterns. Use it judiciously and consider performance implications in your use case.

## Escaping Special Characters

Remember to properly escape special regex characters in your pattern strings. For example, to match a literal period, use `\\.` instead of `.`.

## Further Reading

For more information on JavaScript regular expressions, including pattern syntax and usage, refer to the [MDN Regular Expressions Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).
