import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { profile } from './profile'
import { verifyUserRole } from '@/http/middlewares/verify-role'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/:petId', profile)
  app.post('/pets', { onRequest: [verifyJWT, verifyUserRole('ADMIN')] }, create)
}
