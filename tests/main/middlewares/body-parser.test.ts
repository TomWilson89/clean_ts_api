import { setupApp } from '@main/config/app'
import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('Body Parser middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('should parse as json', async () => {
    const body = { name: 'test' }
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    const res = await request(app).post('/test_body_parser').send(body)
    expect(res.body).toEqual(body)
  })
})
