import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  private items: Org[] = []

  async fetchByCity(city: string) {
    const orgs = this.items.filter((item) =>
      item.address.toUpperCase().includes(city.toUpperCase()),
    )

    return orgs
  }

  async findByCep(cep: string) {
    const org = this.items.find((item) => item.cep === cep)

    if (!org) {
      return null
    }

    return org
  }

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: randomUUID(),
      responsible: data.responsible ?? null,
      email: data.email ?? null,
      password_hash: data.password_hash,
      cep: data.cep,
      address: data.address,
      phone: data.phone,
      title: data.title,
      created_at: new Date(),
    }

    this.items.push(org)

    return org
  }
}
