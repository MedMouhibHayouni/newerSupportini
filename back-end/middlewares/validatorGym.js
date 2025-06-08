const yup = require('yup');

const validate = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      nomSalle: yup.string().required(),
      numTel: yup.string().required(),
      ville: yup.string().required(),
      rue: yup.string().required(),
      codePostal: yup.string().min(4).max(4).required(),
      description: yup.string().required(),
      prix: yup.number().positive().required()
    });

    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({
      error: error.errors
    });
  }
};

module.exports = validate;