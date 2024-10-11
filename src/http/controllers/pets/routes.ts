import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getPet } from './get-pet'
import { searchtPets } from './search-pets'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/', { onRequest: verifyJwt }, create)
  app.get('/:petId', getPet)
  app.get('/', searchtPets)
}
