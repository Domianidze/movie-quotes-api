import { Request, Response, NextFunction } from 'express'

import { Notification } from 'models'
import { validateId } from 'helpers'
import { ErrorType } from 'types'

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.user.id)

    const notification = await Notification.find({ to: req.user.id })
      .select('-__v -to')
      .sort({ _id: -1 })

    res.status(200).json(notification)
  } catch (err) {
    next(err)
  }
}

export const readNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.user.id)
    validateId(req.body.id)

    const notification = await Notification.findOne({ _id: req.body.id })

    if (!notification) {
      const error: ErrorType = new Error('Notification not found.')
      error.statusCode = 404
      throw error
    }

    if (req.user.id.toString() !== notification?.to?.toString()) {
      const error: ErrorType = new Error('Not authorized.')
      error.statusCode = 401
      throw error
    }

    await notification.updateOne({ read: true })

    res.status(200).json({
      message: 'Notification read successfully!',
    })
  } catch (err) {
    next(err)
  }
}
