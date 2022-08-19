const { env } = process

const isLocal = () => env.SERVER_HOST_NAME === 'localhost'

const generateLocalUrl = () => `http://localhost:${env.SERVER_PORT}`

const generateProductionUrl = () =>
  `http://${env.SERVER_HOST_NAME}.${env.SERVER_DOMAIN}`

export default () => {
  const url = isLocal() ? generateLocalUrl() : generateProductionUrl()

  return url
}
