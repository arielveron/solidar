import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  API_PORT: Joi.string().required(),
  DB_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  USERNAME_MAXLENGTH_TO_LOG: Joi.string().required(),
});
