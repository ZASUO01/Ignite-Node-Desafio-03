import { faker } from '@faker-js/faker'

export function createDummyOrg() {
  return {
    name: faker.company.name(),
    ownerName: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    whatsapp: faker.phone.number(),
    cep: faker.location.zipCode(),
    city: faker.location.city(),
    state: faker.location.state(),
    address: faker.location.streetAddress(),
  }
}
