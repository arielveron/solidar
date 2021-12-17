import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  API_PORT: Joi.string().required(),
  DB_URL: Joi.string().required(),
});
