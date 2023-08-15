import { validationResult } from "express-validator";

export const validationMiddleware = (rules) => {
  return [
    ...rules,
    (req, res) => {
      const result = validationResult(req);
      if (result.isEmpty() === false) {
        let errors = {};
        result.array().forEach(({ path, msg }) => {
          errors[path] = msg;
        });
        errors = Object.entries(errors);

        res.json({
          message: "Validation error",
          errors: errors,
        });
      }
    },
  ];
};
