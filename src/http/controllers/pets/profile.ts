import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetPetProfileUseCase } from '@/use-cases/factories/make-get-pet-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function profile(req: FastifyRequest, res: FastifyReply) {
  const profileParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = profileParamsSchema.parse(req.params)

  try {
    const getPetProfileUseCase = makeGetPetProfileUseCase()
    const { pet } = await getPetProfileUseCase.execute({
      petId,
    })

    return res.status(200).send({ pet })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return res.status(409).send({ message: err.message })
    }

    throw err
  }
}
