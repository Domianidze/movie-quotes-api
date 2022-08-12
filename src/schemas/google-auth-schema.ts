import Joi from 'joi'

export default Joi.object({
  photo: Joi.string().uri().required(),
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
})
