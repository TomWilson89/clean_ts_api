import { setupApp } from '@main/config/app'
import { Express } from 'express'
import request from 'supertest'

let app: Express

describe('Content Type middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test_content_type')
    expect(res.get('content-type')).toMatch(/json/)
  })

  test('should return default content type as xml', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.setHeader('Content-Type', 'application/xml')
      res.send('')
    })

    const res = await request(app).get('/test_content_type_xml')
    expect(res.get('content-type')).toMatch(/xml/)
  })
})
