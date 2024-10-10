import { Prisma, Pet } from '@prisma/client'
import { PetsRepository, SearchManyParams } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async searchMany(data: SearchManyParams, orgIds: string[]) {
    const pets = this.items
      .filter((pet) => orgIds.some((orgid) => pet.org_id === orgid))
      .filter((pet) => (data.age ? pet.age === data.age : true))
      .filter((pet) =>
        data.energy_level ? pet.energy_level === data.energy_level : true,
      )
      .filter((pet) =>
        data.environment ? pet.environment === data.environment : true,
      )
      .filter((pet) => (data.size ? pet.size === data.size : true))

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      ...data,
    }

    this.items.push(pet)

    return pet
  }
}
