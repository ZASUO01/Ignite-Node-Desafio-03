import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    age: z.number().max(15),
    energy: z.number().min(1).max(5),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).default('SMALL'),
    independency: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
    requirements: z.string().nullable(),
  })

  const data = createPetBodySchema.parse(req.body)

  try {
    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({
      ...data,
      org_id: req.user.sub,
    })

    return res.status(201).send({ pet })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return res.status(409).send({ message: err.message })
    }

    throw err
  }
}
