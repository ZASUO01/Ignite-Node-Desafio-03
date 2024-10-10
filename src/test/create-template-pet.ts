import { faker } from '@faker-js/faker'

interface OptionalParams {
  age?: string
  size?: string
  energy_level?: string
  environment?: string
}

export function createTemplatePet(params?: OptionalParams) {
  return {
    name: faker.animal.dog(),
    description: faker.lorem.paragraph(),
    age: params?.age ?? faker.number.int.toString(),
    energy_level:
      params?.energy_level ??
      faker.helpers.arrayElement(['low', 'medium', 'high']),
    size:
      params?.size ?? faker.helpers.arrayElement(['small', 'medium', 'large']),
    environment:
      params?.environment ?? faker.helpers.arrayElement(['small', 'large']),
  }
}
