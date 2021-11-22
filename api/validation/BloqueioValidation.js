const yup = require("yup");

const createSemanaValidation = yup.object().shape({
  dia_semana: yup
    .number("'dia_semana' deve ser numérico!")
    .min(0)
    .max(6)
    .required("'dia_semana' obrigatório!"),
  ativo: yup.boolean().required("'ativo' obrigatório!")
});

const updateSemanaValidation = yup.object().shape({
  ativo: yup.boolean().required("'ativo' obrigatório!")
});

const deleteSemanaValidation = yup.object().shape({
  id: yup.number().required("'id' obrigatório!")
});

const createDiaValidation = yup.object().shape({
  data: yup.date().required("'data' obrigatório!"),
  ativo: yup.boolean().required("'ativo' obrigatório!")
});

const getAllDiaValidation = yup.object().shape({
  ano: yup
    .number()
    .min(1900)
    .max(3000)
    .nullable(),
  mes: yup
    .number()
    .min(1)
    .max(12)
    .nullable(),
  ativo: yup.boolean().nullable(),
  simples: yup.boolean().nullable()
});

const updateDiaValidation = yup.object().shape({
  ativo: yup.boolean().required("'ativo' obrigatório!")
});

const deleteDiaValidation = yup.object().shape({
  id: yup.number().required("'id' obrigatório!")
});

module.exports = {
  createSemanaValidation,
  updateSemanaValidation,
  deleteSemanaValidation,
  createDiaValidation,
  getAllDiaValidation,
  updateDiaValidation,
  deleteDiaValidation
};
