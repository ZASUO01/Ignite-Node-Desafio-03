import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'

interface AuthenticateOrgUseCaseRquest {
  email: string
  password: string
}

interface AuthenticateOrgUseCaseResponse {
  org: Org
}

export class AuthenticateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOrgUseCaseRquest): Promise<AuthenticateOrgUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatch = await compare(password, org.password_hash)

    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return {
      org,
    }
  }
}
