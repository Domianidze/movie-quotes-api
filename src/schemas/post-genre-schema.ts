import Joi from 'joi'

export default Joi.object({
  genre: Joi.string()
    .regex(/^[a-zA-Z]*$/)
    .min(3)
    .required(),
})
