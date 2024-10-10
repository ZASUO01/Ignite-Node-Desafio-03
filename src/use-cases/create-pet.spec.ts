import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'
import { createTemplateOrg } from '@/test/create-template-org'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { CreatePetUseCase } from './create-pet'
import { createTemplatePet } from '@/test/create-template-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    const org = await orgsRepository.create({
      owner_name: faker.person.fullName(),
      password_hash: faker.internet.password(),
      ...createTemplateOrg(),
    })

    const { pet } = await sut.execute({
      orgId: org.id,
      ...createTemplatePet(),
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be able to create a pet for non-existing org', async () => {
    await expect(() =>
      sut.execute({
        orgId: 'non-existing-org-id',
        ...createTemplatePet(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
