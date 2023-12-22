import { Pet, Prisma } from '@prisma/client'

export interface PetDetails {
  age?: number
  energy?: number
  size?: 'SMALL' | 'MEDIUM' | 'LARGE'
  independency?: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface PetsRepository {
  findById(petId: string): Promise<Pet | null>
  fetchByOrgId(orgId: string): Promise<Pet[]>
  searchMany(data: PetDetails): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
