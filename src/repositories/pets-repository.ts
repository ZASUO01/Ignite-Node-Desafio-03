import { Pet, Prisma } from '@prisma/client'

export interface SearchManyParams {
  age?: string
  energy_level?: string
  size?: string
  environment?: string
}

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  searchMany(data: SearchManyParams, orgIds: string[]): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
