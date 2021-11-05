import { MongoHelper } from '../infra'
import env from './config/env'

void MongoHelper.connect(env.mongoRul).then(async () => {
  const app = (await import('./config/app')).default
  app.listen(env.port, () =>
    console.log(`[Server]: running on port ${env.port}`)
  )
})
