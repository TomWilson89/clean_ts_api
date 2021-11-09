export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 4000,
  jwtSecret: process.env.JWT_SECRET ?? '9poa78wefh342#Q$R#"ASD'
}
