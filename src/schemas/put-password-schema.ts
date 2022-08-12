import Joi from 'joi'

export default Joi.object({
  password: Joi.string().alphanum().min(8).max(15).lowercase().required(),
})
