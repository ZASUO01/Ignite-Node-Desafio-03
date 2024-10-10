import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { createTemplatePet } from '@/test/create-template-pet'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { SearchPetsUseCase } from './search-pets'
import { createTemplateOrg } from '@/test/create-template-org'
import { faker } from '@faker-js/faker'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: SearchPetsUseCase

let ownerName: string
let password: string

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new SearchPetsUseCase(petsRepository, orgsRepository)

    ownerName = faker.person.fullName()
    password = faker.internet.password()
  })

  it('should be able to search pets by city', async () => {
    const org1 = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: password,
      ...createTemplateOrg({ email: 'email1@example.com' }),
    })

    const org2 = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: password,
      ...createTemplateOrg({ email: 'email2@example.com' }),
    })

    await petsRepository.create({ org_id: org1.id, ...createTemplatePet() })
    await petsRepository.create({ org_id: org1.id, ...createTemplatePet() })
    await petsRepository.create({ org_id: org1.id, ...createTemplatePet() })
    await petsRepository.create({ org_id: org2.id, ...createTemplatePet() })

    const { pets: pets1 } = await sut.execute({ city: org1.city })
    const { pets: pets2 } = await sut.execute({ city: org2.city })

    expect(pets1).toHaveLength(3)
    expect(pets2).toHaveLength(1)
  })

  it('should be able to search pets by city and age', async () => {
    const org1 = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: password,
      ...createTemplateOrg(),
    })

    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ age: '2' }),
    })
    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ age: '3' }),
    })

    const { pets } = await sut.execute({ city: org1.city, age: '2' })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search pets by city and energy level', async () => {
    const org1 = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: password,
      ...createTemplateOrg(),
    })

    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ energy_level: 'medium' }),
    })
    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ energy_level: 'high' }),
    })

    const { pets } = await sut.execute({
      city: org1.city,
      energy_level: 'medium',
    })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search pets by city and environment', async () => {
    const org1 = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: password,
      ...createTemplateOrg(),
    })

    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ environment: 'large' }),
    })
    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ environment: 'small' }),
    })

    const { pets } = await sut.execute({
      city: org1.city,
      environment: 'small',
    })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search pets by city and size', async () => {
    const org1 = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: password,
      ...createTemplateOrg(),
    })

    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ size: 'large' }),
    })
    await petsRepository.create({
      org_id: org1.id,
      ...createTemplatePet({ size: 'small' }),
    })

    const { pets } = await sut.execute({
      city: org1.city,
      size: 'small',
    })

    expect(pets).toHaveLength(1)
  })
})
