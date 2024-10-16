import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateOrgUseCase } from '@/use-cases/factories/make-authenticate-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateOrgUseCase = makeAuthenticateOrgUseCase()
    const { org } = await authenticateOrgUseCase.execute({ email, password })

    const token = await res.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
        },
      },
    )

    const refreshToken = await res.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
          expiresIn: '7d',
        },
      },
    )

    return res
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: error.message })
    }
  }
}
