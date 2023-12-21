import { Org, Prisma } from '@prisma/client'

export interface OrgsRepository {
  fetchByCity(city: string): Promise<Org[]>
  findByCep(cep: string): Promise<Org | null>
  findById(id: string): Promise<Org | null>
  create(data: Prisma.OrgCreateInput): Promise<Org>
}
