import Joi from 'joi'

export default Joi.object({
  user: Joi.string().min(3).required(),
  password: Joi.string().required(),
})
