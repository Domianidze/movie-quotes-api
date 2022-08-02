import Joi from 'joi'

export default Joi.object({
  id: Joi.any(),
  comment: Joi.string().required(),
})
