import Joi from 'joi'

export default Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().alphanum().min(8).max(15).required(),
})
