import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'
import { DuplicatedResourceError } from './errors/duplicated-resource-error'

interface CreateOrgsUseCaseRequest {
  responsible?: string
  email?: string
  password: string
  cep: string
  address: string
  phone: string
  title: string
}

interface CreateOrgsUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    responsible,
    email,
    password,
    cep,
    address,
    phone,
    title,
  }: CreateOrgsUseCaseRequest): Promise<CreateOrgsUseCaseResponse> {
    const passwordHash = await hash(password, 6)

    const orgWithSameCep = await this.orgsRepository.findByCep(cep)

    if (orgWithSameCep) {
      throw new DuplicatedResourceError()
    }

    const org = await this.orgsRepository.create({
      responsible,
      email,
      password_hash: passwordHash,
      cep,
      address,
      phone,
      title,
    })

    return { org }
  }
}
