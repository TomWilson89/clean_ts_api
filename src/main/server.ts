import 'module-alias/register'
import { MongoHelper } from '@infra/db'
import env from './config/env'

void MongoHelper.connect(env.mongoUrl).then(async () => {
  const { setupApp } = await import('./config/app')
  const app = await setupApp()
  app.listen(env.port, () =>
    console.log(`[Server]: running on port ${env.port}`)
  )
})
