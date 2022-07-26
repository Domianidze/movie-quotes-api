import Joi from 'joi'

export default Joi.object({
  newPassword: Joi.string().alphanum().min(8).max(15).required(),
})
