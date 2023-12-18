import { Org, Prisma } from '@prisma/client'

export interface OrgsRepository {
  findByCep(cep: string): Promise<Org | null>
  create(data: Prisma.OrgCreateInput): Promise<Org>
}
