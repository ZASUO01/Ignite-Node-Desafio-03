import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createTemplateOrg } from '@/test/create-template-org'
import { createTemplatePet } from '@/test/create-template-pet'

describe('Create Pet (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
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

    expect(createPetResponse.status).toEqual(201)
  })
})
