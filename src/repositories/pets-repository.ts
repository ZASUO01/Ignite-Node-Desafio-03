import { Pet, Prisma } from '@prisma/client'

export interface PetFilter {
  age: number | null
  energy: number | null
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | null
  independency: 'LOW' | 'MEDIUM' | 'HIGH' | null
}

export interface PetsRepository {
  findById(petId: string): Promise<Pet | null>
  searchMany(orgId: string, filter: PetFilter): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
