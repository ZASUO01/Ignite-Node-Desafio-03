import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetsUseCase } from '../search-pets'

export function makeSearchPetsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const searchPetsUseCase = new SearchPetsUseCase(
    petsRepository,
    orgsRepository,
  )

  return searchPetsUseCase
}
