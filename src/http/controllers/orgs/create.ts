import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createOrgBodySchema = z.object({
    name: z.string(),
    ownerName: z.string(),
    email: z.string(),
    password: z.string().min(6),
    whatsapp: z.string(),
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    address: z.string(),
  })

  const bodyData = createOrgBodySchema.parse(req.body)

  try {
    const createOrgUseCase = makeCreateOrgUseCase()

    const { org } = await createOrgUseCase.execute(bodyData)

    return res.status(201).send(org)
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return res.status(400).send({ message: error.message })
    }
  }
}
