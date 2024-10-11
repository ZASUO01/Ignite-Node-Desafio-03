import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getPet(req: FastifyRequest, res: FastifyReply) {
  const getPetParamsSchema = z.object({
    petId: z.string(),
  })

  const { petId } = getPetParamsSchema.parse(req.params)

  try {
    const getPetUseCase = makeGetPetUseCase()

    const { pet } = await getPetUseCase.execute({ petId })

    return res.status(200).send(pet)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(400).send({ message: error.message })
    }
  }
}
