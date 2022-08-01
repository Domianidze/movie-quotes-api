import Joi from 'joi'

export default Joi.object({
  id: Joi.any(),
  nameEn: Joi.string(),
  nameGe: Joi.string(),
  tags: Joi.array(),
  directorEn: Joi.string(),
  directorGe: Joi.string(),
  descriptionEn: Joi.string(),
  descriptionGe: Joi.string(),
})
