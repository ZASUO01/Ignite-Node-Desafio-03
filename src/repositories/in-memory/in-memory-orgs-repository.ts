import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async getManyByCity(city: string) {
    const orgs = this.items.filter((item) => item.city === city)

    return orgs
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: randomUUID(),
      ...data,
    }

    this.items.push(org)

    return org
  }
}
