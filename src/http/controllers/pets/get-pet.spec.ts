import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createTemplateOrg } from '@/test/create-template-org'
import { createTemplatePet } from '@/test/create-template-pet'

describe('Get Pet (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a pet by id', async () => {
    await request(app.server)
      .post('/orgs')
      .send({
        ...createTemplateOrg({ email: 'johndoe@example.com' }),
        password: '123456',
        ownerName: 'John Doe',
      })

    const authResponse = await request(app.server)
      .post('/orgs/authenticate')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    const createPetResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send({
        ...createTemplatePet(),
      })

    const getPetResponse = await request(app.server)
      .get(`/pets/${createPetResponse.body.id}`)
      .send()

    expect(getPetResponse.status).toEqual(200)
    expect(getPetResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )
  })
})
