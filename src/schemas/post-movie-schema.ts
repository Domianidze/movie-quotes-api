import Joi from 'joi'

export default Joi.object({
  nameEn: Joi.string().required(),
  nameGe: Joi.string().required(),
  tags: Joi.string().required(),
  directorEn: Joi.string().required(),
  directorGe: Joi.string().required(),
  descriptionEn: Joi.string().required(),
  descriptionGe: Joi.string().required(),
})
