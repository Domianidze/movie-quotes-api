import mongoose from 'mongoose'

const { Schema } = mongoose

const movieSchema = new Schema({
  name: {
    type: Object,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  director: {
    type: Object,
    required: true,
  },
  description: {
    type: Object,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

const Movie = mongoose.model('Movie', movieSchema)

export default Movie
