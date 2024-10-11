import { FastifyInstance } from 'fastify'
import { create } from './orgs/create'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/', create)
}
