import app from '@src/app'
import request from 'supertest'

it('Test', async () => {
  const response = await request(app).post('/api/auth/login').send({ name: 'error' })
  expect(response.body).toStrictEqual({})
})
