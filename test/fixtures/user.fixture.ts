import { faker } from '@faker-js/faker'

export function generateUsers(count: number) {
  return Array.from({ length: count }, () => ({
    id: Math.random().toString(36).slice(2),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 60 }),
    gender: faker.datatype.boolean(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'pending',
    ]),
  }))
}
