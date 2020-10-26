// Source: https://gist.github.com/CacheControl/79dd9f5c7e7f798f368e#file-medium-api-parameters-middleware-js
const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true, removeAdditional: true });

exports.addSchemas = (schemas) => {
  for (const schema in schemas) {
    ajv.addSchema(schemas[schema], schema);
  }
};

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
exports.validate = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.body);
    if (!valid) {
      return res.status(400).send(errorResponse(ajv.errors));
    }
    next();
  };
};

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  const errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message,
    };
  });
  return { errors };
}
