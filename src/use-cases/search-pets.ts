import { Pet } from '@prisma/client'
import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'

interface SearchPetsUseCaseRequest {
  city: string
  age?: string
  energy_level?: string
  size?: string
  environment?: string
}

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    city,
    age,
    energy_level,
    size,
    environment,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const cityOrgs = await this.orgsRepository.getManyByCity(city)
    const orgIds = cityOrgs.map((item) => {
      return item.id
    })

    const pets = await this.petsRepository.searchMany(
      { age, energy_level, size, environment },
      orgIds,
    )

    return {
      pets,
    }
  }
}
