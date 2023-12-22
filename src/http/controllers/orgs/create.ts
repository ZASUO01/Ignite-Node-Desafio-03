import { DuplicatedResourceError } from '@/use-cases/errors/duplicated-resource-error'
import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createBodySchema = z.object({
    responsible: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    cep: z.string(),
    address: z.string(),
    phone: z.string(),
    title: z.string(),
  })

  const data = createBodySchema.parse(req.body)

  try {
    const createOrgUseCase = makeCreateOrgUseCase()

    await createOrgUseCase.execute({ ...data })
  } catch (err) {
    if (err instanceof DuplicatedResourceError) {
      return res.status(409).send({ message: err.message })
    }

    throw err
  }

  return res.status(201).send()
}
