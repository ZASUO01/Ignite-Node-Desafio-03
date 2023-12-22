import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Create Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an org', async () => {
    const response = await request(app.server).post('/orgs').send({
      responsible: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
      cep: '33111222',
      address: 'Rua Teste - 67 -Belo Horizonte',
      phone: '11223344',
      title: 'Cute Pets',
    })

    expect(response.statusCode).toEqual(201)
  })
})
