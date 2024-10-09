import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { hash } from 'bcryptjs'

interface CreateOrgUseCaseRequest {
  name: string
  ownerName: string
  email: string
  password: string
  whatsapp: string
  cep: string
  state: string
  city: string
  address: string
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    ownerName,
    email,
    password,
    whatsapp,
    cep,
    state,
    city,
    address,
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      name,
      owner_name: ownerName,
      email,
      password_hash: await hash(password, 6),
      whatsapp,
      cep,
      state,
      city,
      address,
    })

    return {
      org,
    }
  }
}
