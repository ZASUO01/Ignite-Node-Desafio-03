import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createTemplateOrg } from '@/test/create-template-org'

describe('Create Org (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an org', async () => {
    const createResponse = await request(app.server)
      .post('/orgs')
      .send({
        ...createTemplateOrg(),
        password: '123456',
        ownerName: 'John Doe',
      })

    expect(createResponse.status).toEqual(201)
  })
})
