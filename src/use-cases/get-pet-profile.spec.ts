import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { GetPetProfileUseCase } from './get-pet-profile'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetProfileUseCase

describe('Get Pet profile use case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetProfileUseCase(petsRepository)
  })

  it('should be able to get pet profile', async () => {
    const org = await orgsRepository.create({
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password_hash: await hash('123456', 6),
      cep: '33111222',
      address: 'Rua Teste - 67 -Belo Horizonte',
      phone: '11223344',
      title: 'Cute Pets',
    })

    const createdPet = await petsRepository.create({
      name: 'Rex',
      description: '',
      age: 1,
      energy: 4,
      size: 'MEDIUM',
      independency: 'MEDIUM',
      requirements: 'Specific food, It needs space to run',
      org_id: org.id,
    })

    const { pet } = await sut.execute({
      petId: createdPet.id,
    })

    expect(pet.name).toEqual('Rex')
  })

  it('should not be able to get pet profile with non existing id', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
