import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  private Items: Pet[] = []

  async fetchByOrgId(orgId: string) {
    const pets = this.Items.filter((item) => item.org_id === orgId)

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
