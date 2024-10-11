import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createTemplateOrg } from '@/test/create-template-org'

describe('Authenticate Org (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate an org', async () => {
    await request(app.server)
      .post('/orgs')
      .send({
        ...createTemplateOrg({ email: 'johndoe@example.com' }),
        ownerName: 'John Doe',
        password: '123456',
      })

    const authResponse = await request(app.server)
      .post('/orgs/authenticate')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(authResponse.status).toEqual(200)
    expect(authResponse.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })
})
