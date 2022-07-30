import Joi from 'joi'

export default Joi.object({
  user: Joi.string().min(3),
  email: Joi.string().email(),
  redirectOnConfirm: Joi.string().uri().required(),
  language: Joi.string().valid('en', 'ge').required(),
})
