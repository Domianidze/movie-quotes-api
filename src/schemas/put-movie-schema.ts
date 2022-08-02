import Joi from 'joi'

export default Joi.object({
  id: Joi.any(),
  nameEn: Joi.string().regex(/^[a-zA-Z0-9 .,!?'„“():/]*$/),
  nameGe: Joi.string().regex(/^[ა-ჰ0-9 .,!?'„“():/]*$/),
  tags: Joi.string(),
  directorEn: Joi.string().regex(/^[a-zA-Z0-9 .,!?'„“():/]*$/),
  directorGe: Joi.string().regex(/^[ა-ჰ0-9 .,!?'„“():/]*$/),
  descriptionEn: Joi.string().regex(/^[a-zA-Z0-9 .,!?'„“():/]*$/),
  descriptionGe: Joi.string().regex(/^[ა-ჰ0-9 .,!?'„“():/]*$/),
}).min(2)
