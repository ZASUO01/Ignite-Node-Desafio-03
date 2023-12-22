import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'

describe('Pet Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet profile', async () => {
    const { id } = await createAndAuthenticateOrg(app)

    const createdPet = await prisma.pet.create({
      data: {
        name: 'Rex',
        description: '',
        age: 1,
        energy: 4,
        size: 'MEDIUM',
        independency: 'MEDIUM',
        requirements: 'Specific food, It needs space to run',
        org_id: id,
      },
    })

    const response = await request(app.server)
      .get(`/pets/${createdPet.id}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        name: 'Rex',
      }),
    )
  })
})
