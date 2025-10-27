module.exports =
  (schema = {}) =>
  (req, res, next) => {
    try {
      const handle = (s, valueKey) => {
        if (!s) return;
        if (typeof s.parse === "function") {
          req[valueKey] = s.parse(req[valueKey]);
          return;
        }
        if (typeof s.validate === "function") {
          const { error, value } = s.validate(req[valueKey], {
            abortEarly: false,
            stripUnknown: true,
            convert: true,
          });
          if (error) {
            throw {
              errors: error.details?.map((d) => ({
                message: d.message,
                path: d.path,
              })) || [{ message: error.message }],
            };
          }
          req[valueKey] = value;
          return;
        }
      };

      handle(schema.body, "body");
      handle(schema.query, "query");
      handle(schema.params, "params");
      next();
    } catch (e) {
      const errors = e?.errors || [{ message: e.message }];
      res
        .status(400)
        .json({ success: false, message: "Validation error", errors });
    }
  };
