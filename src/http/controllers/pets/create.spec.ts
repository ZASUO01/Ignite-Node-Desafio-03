import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Create Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const { token, id } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post(`/pets`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rex',
        description: '',
        age: 1,
        energy: 4,
        size: 'MEDIUM',
        independency: 'MEDIUM',
        requirements: 'Specific food, It needs space to run',
        org_id: id,
      })

    expect(response.statusCode).toEqual(201)
  })
})
