const yup = require("yup");

const createLogConsultaValidation = yup.object().shape({
  descricao: yup
    .string("'descricao' deve ser string!")
    .max(150, "'descricao' deve ter no máximo 150 caracteres!"),
  usuario_id: yup
    .number("'usuario_id' deve ser numérico!")
    .required("'usuario_id' obrigatório!"),
  consulta_id: yup
    .number("'consulta_id' deve ser numérico!")
    .required("'consulta_id' obrigatório!")
});

module.exports = {
  createLogConsultaValidation,
};
