const { env } = process

const isAtlas = () => env.MONGO_PROTOCOL === 'mongodb+srv'

const generateAtlasUrl = () =>
  `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}/${env.MONGO_DATABASE}`

const generateLocalUrl = () =>
  `mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`

export default () => {
  const url = isAtlas() ? generateAtlasUrl() : generateLocalUrl()

  return url
}
