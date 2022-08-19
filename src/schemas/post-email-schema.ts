import Joi from 'joi'

export default Joi.object({
  email: Joi.string().email().required(),
  redirectOnConfirm: Joi.string().uri().required(),
  language: Joi.string().valid('en', 'ge').required(),
})
