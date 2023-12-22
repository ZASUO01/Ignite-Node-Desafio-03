import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await request(app.server).post('/orgs').send({})

  const org = await prisma.org.create({
    data: {
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password_hash: await hash('123456', 6),
      cep: '33111222',
      address: 'Rua Teste - 67 -Belo Horizonte',
      phone: '11223344',
      title: 'Cute Pets',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'jonhdoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token, id: org.id }
}
