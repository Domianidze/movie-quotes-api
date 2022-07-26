import Joi from 'joi'

export default Joi.object({
  redirectOnConfirm: Joi.string().uri().required(),
  language: Joi.string().valid('en', 'ge').required(),
})
