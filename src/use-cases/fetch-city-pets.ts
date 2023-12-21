import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface FetchCityPetsUseCaseRequest {
  city: string
  page: number
}

interface FetchCityPetsUseCaseResponse {
  pets: Pet[]
}

export class FetchCityPetsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    city,
    page,
  }: FetchCityPetsUseCaseRequest): Promise<FetchCityPetsUseCaseResponse> {
    let pets: Pet[] = []

    const orgs = await this.orgsRepository.fetchByCity(city)

    if (orgs.length > 0) {
      for await (const org of orgs) {
        const thisOrgPets = await this.petsRepository.fetchByOrgId(org.id)
        pets = pets.concat(thisOrgPets)
      }
    }

    pets = pets.slice((page - 1) * 20, page * 20)

    return {
      pets,
    }
  }
}
