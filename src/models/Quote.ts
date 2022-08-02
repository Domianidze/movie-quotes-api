import mongoose from 'mongoose'

const { Schema } = mongoose

const quoteSchema = new Schema({
  quoteEn: {
    type: String,
    required: true,
  },
  quoteGe: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Quote = mongoose.model('Quote', quoteSchema)

export default Quote
