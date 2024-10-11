import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createTemplateOrg } from '@/test/create-template-org'
import { createTemplatePet } from '@/test/create-template-pet'

describe('Search Pet (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to seatch pets by city and optional params', async () => {
    const org = createTemplateOrg({ email: 'johndoe@example.com' })

    await request(app.server)
      .post('/orgs')
      .send({
        ...org,
        password: '123456',
        ownerName: 'John Doe',
      })

    const authResponse = await request(app.server)
      .post('/orgs/authenticate')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    const tempPet = createTemplatePet()

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send(tempPet)

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send(tempPet)

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send(createTemplatePet())

    const searchPetsResponse = await request(app.server)
      .get('/pets')
      .query({ city: org.city, size: tempPet.size, age: tempPet.age })
      .send()

    expect(searchPetsResponse.status).toEqual(200)
    expect(searchPetsResponse.body).toHaveLength(2)
  })
})
