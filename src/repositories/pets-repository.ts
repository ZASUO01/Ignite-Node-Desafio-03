import { Pet, Prisma } from '@prisma/client'

export interface PetsRepository {
  fetchByOrgId(orgId: string): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
