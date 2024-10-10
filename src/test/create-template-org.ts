import { faker } from '@faker-js/faker'

interface OptionalParams {
  email?: string
}

export function createTemplateOrg(params?: OptionalParams) {
  return {
    email: params?.email ?? faker.internet.email(),
    cep: faker.location.zipCode(),
    city: faker.location.city(),
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    state: faker.location.state(),
    whatsapp: faker.phone.number(),
  }
}
