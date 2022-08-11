import { Request, Response, NextFunction } from 'express'

import { Notification } from 'models'
import { validateId } from 'helpers'

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
