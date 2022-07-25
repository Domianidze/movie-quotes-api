export interface ErrorType {
  name: string
  message: string
  stack?: string
  statusCode?: number
}

interface JwtPayloadType {
  id?: string
}
