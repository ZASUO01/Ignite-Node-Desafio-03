import { FastifyInstance } from 'fastify'
import { create } from './create'
import { authenticate } from './authenticate'
import { refresh } from './refresh'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.post('/authenticate', authenticate)
  app.post('/refresh', refresh)
}
