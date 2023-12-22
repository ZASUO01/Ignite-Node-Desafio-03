import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { prisma } from '@/lib/prisma'

export class PrismaOrgsRepository implements OrgsRepository {
  async fetchByCity(city: string) {
    const orgs = await prisma.$queryRaw<Org[]>`
            SELECT * FROM orgs WHERE upper(address) like '%${city.toUpperCase()}%' 
        `

    return orgs
  }

  async findById(id: string) {
    const org = await prisma.org.findUnique({
      where: {
        id,
      },
    })

    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    })

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({
      data,
    })

    return org
  }
}
