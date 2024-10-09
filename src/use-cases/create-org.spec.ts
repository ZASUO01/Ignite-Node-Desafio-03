import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateOrgUseCase } from './create-org'
import { createDummyOrg } from '@/test/createDummyOrg'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { compare } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe('Create Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it('should be able to create an org', async () => {
    const dummyOrg = createDummyOrg()

    const { org } = await sut.execute(dummyOrg)

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to create and org with existant email', async () => {
    const dummyOrg = createDummyOrg()

    await sut.execute(dummyOrg)

    await expect(() => sut.execute(dummyOrg)).rejects.toBeInstanceOf(
      OrgAlreadyExistsError,
    )
  })

  it('should hash the password uppon creation', async () => {
    const dummyOrg = createDummyOrg()

    const { org } = await sut.execute(dummyOrg)

    const doesPasswordMatch = await compare(
      dummyOrg.password,
      org.password_hash,
    )

    expect(doesPasswordMatch).toBeTruthy()
  })
})
