import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchtPets(req: FastifyRequest, res: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    city: z.string(),
    age: z.string().optional(),
    energy_level: z.string().optional(),
    size: z.string().optional(),
    environment: z.string().optional(),
  })

  const { city, age, energy_level, size, environment } =
    searchPetsQuerySchema.parse(req.query)

  const searchPetsUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetsUseCase.execute({
    city,
    age,
    energy_level,
    size,
    environment,
  })

  return res.status(200).send(pets)
}
