import paths from '../docs/paths'
import components from './components'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    version: '1.0.0',
    description: 'Survey API developed with TDD'
  },
  license: {
    name: 'MIT',
    url: 'https://choosealicense.com/licenses/mit/'
  },
  servers: [
    {
      url: '/api',
      description: 'Main Server'
    }
  ],
  tags: [
    {
      name: 'Login',
      description: 'API related to authorization and authentication'
    },
    {
      name: 'Survey',
      description: 'API related to surveys'
    }
  ],
  paths,
  schemas,
  components
}
