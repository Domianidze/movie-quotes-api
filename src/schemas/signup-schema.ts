import Joi from 'joi'

export default Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(8).max(15).required(),
  redirectOnConfirm: Joi.string().uri().required(),
  language: Joi.string().valid('en', 'ge').required(),
})
