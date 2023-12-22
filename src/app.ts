import fastify from 'fastify'
import { env } from './env'
import { ZodError } from 'zod'
import { orgsRoutes } from './http/controllers/orgs/routes'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { petsRoutes } from './http/controllers/pets/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(orgsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _, res) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // Todo
  }

  return res.status(500).send({ message: 'Internal server error.' })
})
