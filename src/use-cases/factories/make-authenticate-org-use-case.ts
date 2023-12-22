import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { AuthenticateOrgUseCase } from '../authenticate-org'

export function makeAuthenticateOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const authenticateOrgsUseCase = new AuthenticateOrgUseCase(orgsRepository)

  return authenticateOrgsUseCase
}
