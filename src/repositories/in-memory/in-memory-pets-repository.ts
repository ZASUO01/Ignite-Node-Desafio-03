import { Pet, Prisma } from '@prisma/client'
import { PetsRepository, PetFilter } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  private Items: Pet[] = []

  async findById(petId: string) {
    const pet = this.Items.find((item) => item.id === petId)

    if (!pet) {
      return null
    }

    return pet
  }

  async searchMany(orgId: string, filter: PetFilter) {
    let pets: Pet[] = this.Items

    pets = pets.filter((item) => item.org_id === orgId)

    pets = filter.age ? pets.filter((item) => item.age === filter.age) : pets
    pets = filter.energy
      ? pets.filter((item) => item.energy === filter.energy)
      : pets
    pets = filter.size ? pets.filter((item) => item.size === filter.size) : pets
    pets = filter.independency
      ? pets.filter((item) => item.independency === filter.independency)
      : pets

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? null,
      age: data.age,
      energy: data.energy,
      size: data.size,
      independency: data.independency,
      requirements: data.requirements ?? null,
      org_id: data.org_id,
      created_at: new Date(),
    }

    this.Items.push(pet)

    return pet
  }
}
