'use strict';

function runValidation(schema, source = 'body') {
  return (req, res, next) => {
    const target = req[source] || {};
    const { error, value } = schema.validate(target, { abortEarly: false, stripUnknown: true });

    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((item) => ({
          field: item.path.join('.'),
          message: item.message,
        })),
      });
    }

    req[source] = value;
    next();
  };
}

runValidation.body = (schema) => runValidation(schema, 'body');
runValidation.query = (schema) => runValidation(schema, 'query');
runValidation.params = (schema) => runValidation(schema, 'params');

module.exports = runValidation;
