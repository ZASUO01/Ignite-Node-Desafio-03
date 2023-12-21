import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { FetchCityPetsUseCase } from './fetch-city-pets'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: FetchCityPetsUseCase

describe(' Fetch City Pets Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchCityPetsUseCase(petsRepository, orgsRepository)
  })

  it('should be able to fetch pets by city', async () => {
    const cityOrg = await orgsRepository.create({
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password_hash: await hash('123456', 6),
      cep: '33111222',
      address: 'Rua Teste - 67 -Belo Horizonte',
      phone: '11223344',
      title: 'Cute Pets',
    })

    const outOfTheCityOrg = await orgsRepository.create({
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password_hash: await hash('123456', 6),
      cep: '33111255',
      address: 'Rua Teste - 68 - São Paulo',
      phone: '11223344',
      title: 'Cute Pets',
    })

    await petsRepository.create({
      name: 'Rex',
      description: 'Pet of this city',
      age: 1,
      energy: 4,
      size: 'MEDIUM',
      independency: 'MEDIUM',
      requirements: 'Specific food, It needs space to run',
      org_id: cityOrg.id,
    })

    await petsRepository.create({
      name: 'Doug',
      description: 'Out of the city pet',
      age: 1,
      energy: 4,
      size: 'MEDIUM',
      independency: 'MEDIUM',
      requirements: 'Specific food, It needs space to run',
      org_id: outOfTheCityOrg.id,
    })

    const { pets } = await sut.execute({
      city: 'Belo Horizonte',
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Rex' })])
  })
})
