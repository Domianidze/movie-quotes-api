import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  photo: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  activated: {
    type: Boolean,
  },
  googleAccount: {
    type: Boolean,
  },
  emails: [
    {
      email: String,
      activated: Boolean,
    },
  ],
})

const User = mongoose.model('User', userSchema)

export default User
