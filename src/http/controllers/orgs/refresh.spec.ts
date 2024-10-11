import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createTemplateOrg } from '@/test/create-template-org'

describe('Refresh Token (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh the jwt token', async () => {
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

    const cookies = authResponse.get('Set-Cookie') ?? []

    const refreshResponse = await request(app.server)
      .post('/orgs/refresh')
      .set('Cookie', cookies)
      .send()

    expect(refreshResponse.status).toEqual(200)
    expect(refreshResponse.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
    expect(refreshResponse.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
