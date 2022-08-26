import Joi from 'joi'

export default Joi.object({
  id: Joi.any(),
  quoteEn: Joi.string().regex(/^[a-zA-Z0-9 -.,!?'„“():/\s\s+]*$/),
  quoteGe: Joi.string().regex(/^[ა-ჰ0-9 -.,!?'„“():/\s\s+]*$/),
  movie: Joi.any(),
})
