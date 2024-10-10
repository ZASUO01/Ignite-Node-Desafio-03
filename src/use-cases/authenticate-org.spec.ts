import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateOrgUseCase } from './authenticate-org'
import { createTemplateOrg } from '@/test/create-template-org'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateOrgUseCase

let ownerName: string
let password: string

describe('Authenticate org use case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOrgUseCase(orgsRepository)

    ownerName = faker.person.fullName()
    password = faker.internet.password()
  })

  it('should be able to authenticate a org', async () => {
    const org = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: await hash(password, 6),
      ...createTemplateOrg(),
    })

    const { org: authenticatedOrg } = await sut.execute({
      email: org.email,
      password,
    })

    expect(authenticatedOrg).toEqual(org)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong-email@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const org = await orgsRepository.create({
      owner_name: ownerName,
      password_hash: await hash('right-password', 6),
      ...createTemplateOrg(),
    })

    await expect(() =>
      sut.execute({ email: org.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
