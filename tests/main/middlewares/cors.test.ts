import app from '@main/config/app'
import request from 'supertest'

describe('Cors middleware', () => {
  test('should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })

    const res = await request(app).get('/test_cors')
    expect(res.header['access-control-allow-origin']).toBe('*')
    expect(res.header['access-control-allow-methods']).toBe(
      'GET, POST, PUT, DELETE'
    )
    expect(res.header['access-control-allow-headers']).toBe(
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
  })
})
