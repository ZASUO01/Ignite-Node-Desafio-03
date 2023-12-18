import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface CreatePetUseCaseRequest {
  name: string
  description?: string
  age: number
  energy: number
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
  independency: 'LOW' | 'MEDIUM' | 'HIGH'
  requirements?: string | null
  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    description,
    age,
    energy,
    size,
    independency,
    requirements,
    org_id,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      description,
      age,
      energy,
      size,
      independency,
      requirements,
      org_id,
    })

    return { pet }
  }
}
