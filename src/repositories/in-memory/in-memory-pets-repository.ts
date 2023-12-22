import { Pet, Prisma } from '@prisma/client'
import { PetsRepository, PetDetails } from '../pets-repository'
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

  async fetchByOrgId(orgId: string) {
    const pets = this.Items.filter((item) => item.org_id === orgId)

    return pets
  }

  async searchMany(data: PetDetails) {
    let pets: Pet[] = this.Items

    pets = data.age ? pets.filter((item) => item.age === data.age) : pets
    pets = data.energy
      ? pets.filter((item) => item.energy === data.energy)
      : pets
    pets = data.size ? pets.filter((item) => item.size === data.size) : pets
    pets = data.independency
      ? pets.filter((item) => item.independency === data.independency)
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
