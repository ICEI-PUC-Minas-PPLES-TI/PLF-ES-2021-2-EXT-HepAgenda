const yup = require('yup');

const createTratamentoValidation = yup.object().shape({
  identificacao: yup.string().required("'identificacao' obrigatório!"),
  direcionado: yup
    .mixed()
    .oneOf(["HEPB", "HEPC", "OUTRO"])
    .required("'direcionado' obrigatório"),
});

const updateTratamentoValidation = yup.object().shape({
  identificacao: yup.string(),
  direcionado: yup
    .mixed()
    .oneOf(["HEPB", "HEPC", "OUTRO"]),
  ativo: yup.bool()
});

module.exports = {
  createTratamentoValidation,
  updateTratamentoValidation
}
