import Joi from 'joi'

export default Joi.object({
  nameEn: Joi.string()
    .regex(/^[a-zA-Z0-9 -.,!?'„“():/]*$/)
    .required(),
  nameGe: Joi.string()
    .regex(/^[ა-ჰ0-9 -.,!?'„“():/]*$/)
    .required(),
  genres: Joi.string(),
  directorEn: Joi.string()
    .regex(/^[a-zA-Z0-9 -.,!?'„“():/]*$/)
    .required(),
  directorGe: Joi.string()
    .regex(/^[ა-ჰ0-9 -.,!?'„“():/]*$/)
    .required(),
  descriptionEn: Joi.string()
    .regex(/^[a-zA-Z0-9 -.,!?'„“():/\s\s+]*$/)
    .required(),
  descriptionGe: Joi.string()
    .regex(/^[ა-ჰ0-9 -.,!?'„“():/\s\s+]*$/)
    .required(),
})
