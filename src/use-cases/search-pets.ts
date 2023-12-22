import { PetsRepository } from '@/repositories/pets-repository'

interface SearchPetsUseCaseRequest {
  age?: number
  energy?: number
  size?: 'SMALL' | 'MEDIUM' | 'LARGE'
  independency?: 'LOW' | 'MEDIUM' | 'HIGH'
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ age, energy, size, independency }: SearchPetsUseCaseRequest) {
    const pets = await this.petsRepository.searchMany({
      age,
      energy,
      size,
      independency,
    })

    return { pets }
  }
}
