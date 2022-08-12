import mongoose from 'mongoose'

const { Schema } = mongoose

const notificationSchema = new Schema({
  notification: {
    type: String,
    enum: ['commented', 'reacted'],
    required: true,
  },
  read: { type: Boolean, default: false },
  date: { type: Date, default: new Date() },
  quote: {
    type: Schema.Types.ObjectId,
    ref: 'Quote',
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
