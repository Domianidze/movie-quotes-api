import mongoose from 'mongoose'

const { Schema } = mongoose

const movieSchema = new Schema({
  nameEn: {
    type: String,
    required: true,
  },
  nameGe: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  directorEn: {
    type: String,
    required: true,
  },
  directorGe: {
    type: String,
    required: true,
  },
  descriptionEn: {
    type: String,
    required: true,
  },
  descriptionGe: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Movie = mongoose.model('Movie', movieSchema)

export default Movie
