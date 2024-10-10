import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { createTemplatePet } from '@/test/create-template-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetPetUseCase } from './get-pet'

let petsRepository: InMemoryPetsRepository
let sut: GetPetUseCase

describe('Get Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to get a pet', async () => {
    const createdPet = await petsRepository.create({
      org_id: 'example-org',
      ...createTemplatePet(),
    })

    const { pet } = await sut.execute({
      petId: createdPet.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet).toEqual(createdPet)
  })

  it('should not be able to get a non-existing pet', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-existing-pet-id',
        ...createTemplatePet(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
