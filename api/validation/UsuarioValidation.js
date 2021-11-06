const yup = require("yup");
const { senhaRegEx, telefoneRegExp } = require("../helpers/Regex");

const tipos = ["A", "M", "V"];

const signinUsuarioValidation = yup.object().shape({
  email: yup
    .string()
    .email()
    .required("'email' obrigatório!"),
  senha: yup.string().required("'senha' obrigatória!")
});

const createUsuarioValidation = yup.object().shape({
  nome: yup.string().required("'nome' obrigatório!"),
  telefone: yup.string().matches(telefoneRegExp, "'telefone' inválido!"),

  login: yup.string().min(3, "'login' deve ter no mínimo 3 caracteres!"),

  email: yup
    .string()
    .email()
    .required("'email' obrigatório!"),
  senha: yup
    .string()
    .required("'senha' obrigatória!")
    .matches(
      senhaRegEx,
      "'senha' deve ter no mínimo 8 caracteres, 1 maiúsculo, 1 minúsculo e 1 número!"
    ),

  tipo: yup
    .mixed()
    .oneOf(tipos, `'tipo' deve ser algum destes: ${tipos}.`)
    .required("'tipo' obrigatório!")
});

const updateUsuarioValidation = yup.object().shape({
  nome: yup.string(),
  telefone: yup.string().matches(telefoneRegExp, "Telefone inválido!"),

  login: yup.string().min(3, "Login deve ter no mínimo 3 caracteres!"),

  email: yup.string().email(),
  senha: yup
    .string()
    .matches(
      senhaRegEx,
      "Senha deve ter no mínimo 8 caracteres, 1 maiúsculo, 1 minúsculo e 1 número!"
    ),

  tipo: yup.mixed().oneOf(tipos, `Tipo deve ser algum destes: ${tipos}.`)
});

module.exports = {
  signinUsuarioValidation,
  createUsuarioValidation,
  updateUsuarioValidation,
};
