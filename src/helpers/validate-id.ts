import { ErrorType } from 'types'

export default (id: string) => {
  if (!id.match(/^[a-f\d]{24}$/i)) {
    const error: ErrorType = new Error('Invalid id.')
    error.statusCode = 422
    throw error
  }
}
