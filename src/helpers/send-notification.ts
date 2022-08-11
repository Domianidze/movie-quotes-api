import { Notification } from 'models'

const sendNotification = async (
  notification: 'commented' | 'reacted',
  quote: string,
  to: string | undefined,
  from: string
) => {
  if (!to || to === from) return

  const existingNotification = await Notification.findOne({
    notification,
    quote,
    to,
    from,
  })

  if (existingNotification) return

  await Notification.create({
    notification,
    quote,
    to,
    from,
  })
}

export default sendNotification
