import { prisma } from '@/lib/prisma'
import { PetsRepository, PetFilter } from '../pets-repository'
import { Prisma } from '@prisma/client'

export class PrismaPetsRepository implements PetsRepository {
  async findById(petId: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    })

    return pet
  }

  async searchMany(orgId: string, filter: PetFilter) {
    const data = {
      org_id: orgId,
      age: filter.age ?? undefined,
      energy: filter.energy ?? undefined,
      size: filter.size ?? undefined,
      independency: filter.independency ?? undefined,
    }

    const pets = await prisma.pet.findMany({
      where: data,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
