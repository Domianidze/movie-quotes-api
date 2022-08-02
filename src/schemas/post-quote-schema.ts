import Joi from 'joi'

export default Joi.object({
  quoteEn: Joi.string()
    .regex(/^[a-zA-Z0-9 .,!?'„“():/]*$/)
    .required(),
  quoteGe: Joi.string()
    .regex(/^[ა-ჰ0-9 .,!?'„“():/]*$/)
    .required(),
  movie: Joi.any(),
})
