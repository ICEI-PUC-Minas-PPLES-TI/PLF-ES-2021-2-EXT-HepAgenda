const yup = require("yup");
const statusCriacaoEnum = ["AGUARDANDOC", "AGUARDANDOA", "REALIZADO"];
const statusUpdateEnum = ["AGUARDANDOC", "AGUARDANDOA", "REALIZADO", "CANCELADO"];

const createConsultaValidation = yup.object().shape({
  paciente_id: yup
    .number("'paciente_id' deve ser numérico!")
    .required("'paciente_id' obrigatório!"),
  descricao: yup
    .string("'descricao' deve ser string!")
    .max(60, "'descricao' deve ter no máximo 60 caracteres!"),
  status: yup
    .mixed()
    .oneOf(
      statusCriacaoEnum,
      `'status' deve ser algum destes: ${statusCriacaoEnum}.`
    )
    .required("'status' obrigatório!"),
  detalhes: yup
    .string("'detalhes' deve ser string!")
    .max(65000, "'detalhes' deve ter no máximo 65000 caracteres!"),
  dt_inicio: yup
    .date("'dt_inicio' deve ser data!")
    .required("'dt_inicio' obrigatório!"),
  usuario_id_medico: yup.number("'usuario_id_medico' deve ser numérico!")
});

const updateConsultaValidation = yup.object().shape({
  paciente_id: yup.number("'paciente_id' deve ser numérico!"),
  descricao: yup
    .string("'descricao' deve ser string!")
    .max(60, "'descricao' deve ter no máximo 60 caracteres!"),
  status: yup
    .mixed()
    .oneOf(statusUpdateEnum, `'status' deve ser algum destes: ${statusUpdateEnum}.`),
  detalhes: yup
    .string("'detalhes' deve ser string!")
    .max(65000, "'detalhes' deve ter no máximo 65000 caracteres!"),
  dt_inicio: yup.date("'dt_inicio' deve ser data!"),
  usuario_id_medico: yup.number("'usuario_id_medico' deve ser numérico!")
});

module.exports = {
  createConsultaValidation,
  updateConsultaValidation
};
