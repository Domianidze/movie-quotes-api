import Joi from 'joi'

export default Joi.object({
  username: Joi.string().min(3),
})
