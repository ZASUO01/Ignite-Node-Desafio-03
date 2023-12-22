import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface SearchPetsUseCaseRequest {
  page: number
  city: string
  age: number | null
  energy: number | null
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | null
  independency: 'LOW' | 'MEDIUM' | 'HIGH' | null
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
    page,
    age,
    energy,
    size,
    independency,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    let pets: Pet[] = []

    const orgs = await this.orgsRepository.fetchByCity(city)

    if (orgs.length > 0) {
      for await (const org of orgs) {
        const thisOrgPets = await this.petsRepository.searchMany(org.id, {
          age,
          energy,
          size,
          independency,
        })
        pets = pets.concat(thisOrgPets)
      }
    }

    pets = pets.slice((page - 1) * 20, page * 20)

    return {
      pets,
    }
  }
}
