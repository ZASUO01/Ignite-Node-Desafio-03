import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    age: z.string(),
    energy_level: z.string(),
    size: z.string(),
    environment: z.string(),
  })

  const bodyData = createPetBodySchema.parse(req.body)
  const orgId = req.user.sub

  try {
    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({ ...bodyData, orgId })

    return res.status(201).send(pet)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(400).send({ message: error.message })
    }
  }
}
