import app from '@/main/config/app'
import request from 'supertest'

describe('SignUp routes', () => {
  test('should return an account on success', async () => {
    const res = await request(app).post('/api/signup').send({
      name: 'John Doe',
      email: 'john@mail.com',
      password: '123456',
      passwordConfirmation: '123456'
    })

    expect(res.status).toBe(200)
  })
})
