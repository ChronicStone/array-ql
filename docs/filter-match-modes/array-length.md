# Array Length Match Mode

The 'arrayLength' match mode checks the length of an array field against a specified value.

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', skills: ['JavaScript', 'TypeScript', 'React'] },
  { id: 2, name: 'Jane', skills: ['Python', 'Django'] },
  { id: 3, name: 'Bob', skills: ['Java', 'Spring', 'Hibernate', 'SQL'] }
]

const result = query(data, {
  filter: [
    { key: 'skills', matchMode: 'arrayLength', value: 3 }
  ]
})
```

Output:
```ts twoslash
[
  { id: 1, name: 'John', skills: ['JavaScript', 'TypeScript', 'React'] }
]
```

This filter returns all items where the 'skills' array has exactly 3 elements.

You can also use comparison operators with 'arrayLength':

```ts twoslash
import { query } from '@chronicstone/array-query'

const data = [
  { id: 1, name: 'John', skills: ['JavaScript', 'TypeScript', 'React'] },
  { id: 2, name: 'Jane', skills: ['Python', 'Django'] },
  { id: 3, name: 'Bob', skills: ['Java', 'Spring', 'Hibernate', 'SQL'] }
]

const result = query(data, {
  filter: [
    { key: 'skills', matchMode: 'arrayLength', value: 2 }
  ]
})
```

Output:
```ts twoslash
[
  { id: 2, name: 'Jane', skills: ['Python', 'Django'] },
]
```

This filter returns all items where the 'skills' array has more than 2 elements.
