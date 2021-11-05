import app from '@/main/config/app'
import request from 'supertest'

describe('Body Parser middleware', () => {
  test('should parse as json', async () => {
    const body = { name: 'test' }
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    const res = await request(app).post('/test_body_parser').send(body)
    expect(res.body).toEqual(body)
  })
})
