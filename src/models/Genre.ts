import mongoose from 'mongoose'

const { Schema } = mongoose

const genreSchema = new Schema({
  genre: {
    type: String,
    required: true,
  },
})

genreSchema.index({ '$**': 'text' })

const Genre = mongoose.model('Genre', genreSchema)

export default Genre
