import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateOrgUseCase } from './create-org'
import { compare } from 'bcryptjs'
import { DuplicatedResourceError } from './errors/duplicated-resource-error'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe(' Create Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it('should be able to create an org', async () => {
    const { org } = await sut.execute({
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      cep: '33111222',
      address: 'Rua Teste - 67 -Belo Horizonte',
      phone: '11223344',
      title: 'Cute Pets',
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.cep).toEqual('33111222')
  })

  it('should hash the given password', async () => {
    const { org } = await sut.execute({
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      cep: '33111222',
      address: 'Rua Teste - 67 -Belo Horizonte',
      phone: '11223344',
      title: 'Cute Pets',
    })

    const isPasswordCorrectlyHashed = await compare('123456', org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create an org with a duplicated cep', async () => {
    const cep = '33111222'

    await sut.execute({
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      cep,
      address: 'Rua Teste - 67 -Belo Horizonte',
      phone: '11223344',
      title: 'Cute Pets',
    })

    await expect(
      sut.execute({
        responsible: 'Jonh Doe',
        email: 'jonhdoe@example.com',
        password: '123456',
        cep,
        address: 'Rua Teste - 67 -Belo Horizonte',
        phone: '11223344',
        title: 'Cute Pets',
      }),
    ).rejects.toBeInstanceOf(DuplicatedResourceError)
  })
})
