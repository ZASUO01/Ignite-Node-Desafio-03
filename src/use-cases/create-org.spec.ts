import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateOrgUseCase } from './create-org'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { compare } from 'bcryptjs'
import { faker } from '@faker-js/faker'
import { createTemplateOrg } from '@/test/create-template-org'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

let ownerName: string
let password: string

describe('Create Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)

    ownerName = faker.person.fullName()
    password = faker.internet.password()
  })

  it('should be able to create an org', async () => {
    const { org } = await sut.execute({
      ownerName,
      password,
      ...createTemplateOrg(),
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to create an org with existant email', async () => {
    const tempOrg = createTemplateOrg()

    await orgsRepository.create({
      owner_name: ownerName,
      password_hash: password,
      ...tempOrg,
    })

    await expect(() =>
      sut.execute({
        ownerName,
        password,
        ...tempOrg,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })

  it('should hash the password uppon creation', async () => {
    const tempOrg = createTemplateOrg()

    const { org } = await sut.execute({
      ownerName,
      password,
      ...tempOrg,
    })

    const doesPasswordMatch = await compare(password, org.password_hash)

    expect(doesPasswordMatch).toBeTruthy()
  })
})
