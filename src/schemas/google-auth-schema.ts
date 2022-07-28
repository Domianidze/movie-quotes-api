import Joi from 'joi'

export default Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
})
