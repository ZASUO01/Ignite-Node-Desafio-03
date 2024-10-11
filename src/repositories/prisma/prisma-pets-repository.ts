import { Pet, Prisma } from '@prisma/client'
import { PetsRepository, SearchManyParams } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: { id },
    })

    return pet
  }

  async searchMany(data: SearchManyParams, orgIds: string[]): Promise<Pet[]> {
    const pets = await prisma.pet.findMany({
      where: {
        org_id: {
          in: orgIds,
        },
        age: data.age,
        size: data.size,
        energy_level: data.energy_level,
        environment: data.environment,
      },
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
