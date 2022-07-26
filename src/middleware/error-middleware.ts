import { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: any, _: Request, res: Response, __: NextFunction) => {
  if (err.isJoi) {
    err.statusCode = 422
  }

  if (!err.statusCode) {
    err.statusCode = 500
  }

  res.status(err.statusCode).json({
    message: err.message,
  })
}
