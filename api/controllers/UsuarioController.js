const Usuario = require("../models/Usuario");
const { SortPaginate } = require("../helpers/SortPaginate");

const yup = require("yup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class UsuarioController {
  async signin(req, res) {
    const { email, senha } = req.body;

    Usuario.findOne({
      where: {
        email: email
      }
    })
      .then(usuario => {
        if (!usuario) {
          return res.status(404).send("Usuario nao encontrado.");
        }

        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) {
          return res.status(401).send({
            autenticado: false,
            acessoToken: null,
            razao: "Senha incorreta!"
          });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
          expiresIn: 604800 // 1 semana expira
        });

        res.status(200).send({ autenticado: true, acessoToken: token });
      })
      .catch(err => {
        res.status(500).send("Erro -> " + err);
      });
  }

  async create(request, response) {
    const telefoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const senhaRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    /*
      /^
        (?=.*\d)          // deve ter no mínimo 1 número
        (?=.*[a-z])       // deve ter no mínimo 1 letra minúscula
        (?=.*[A-Z])       // deve ter no mínimo 1 letra maiúscula
        [a-zA-Z0-9]{8,}   // deve ter no mínimo 8 caracteres alfanuméricos
      $/
    */

    // Em breve buscar dos tipos automaticamente no banco de dados.
    const tipos = ["A", "M", "V"];

    const scheme = yup.object().shape({
      nome: yup.string().required("Nome obrigatório!"),
      telefone: yup.string().matches(telefoneRegExp, "Telefone inválido!"),

      login: yup.string().min(3, "Login deve ter no mínimo 3 caracteres!"),

      email: yup
        .string()
        .email()
        .required("Email obrigatório!"),
      senha: yup
        .string()
        .required("Senha obrigatória!")
        .matches(
          senhaRegEx,
          "Senha deve ter no mínimo 8 caracteres, 1 maiúsculo, 1 minúsculo e 1 número!"
        ),
      senhaRepetida: yup
        .string()
        .required("Senhas repetida é obrigatória!")
        .oneOf([yup.ref("senha"), null], "Senhas devem ser iguais"),

      tipo: yup
        .mixed()
        .oneOf(tipos, `Tipo deve ser algum destes: ${tipos}.`)
        .required("Tipo obrigatório!")
    });

    // Validando com o esquema criado:
    try {
      await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
    } catch (erro) {
      return response.status(422).json({
        criado: false,
        "nome:": erro.name, // => 'ValidationError'
        erros: erro.errors
      });
    }

    const { nome, email, telefone, login, senha, tipo } = request.body;
    const password = bcrypt.hashSync(senha, 8);

    const usuario = Usuario.build({
      nome,
      email,
      telefone: telefone,
      login: login,
      senha: password,
      tipo: tipo
    });

    usuario
      .save()
      .then(function(anotherTask) {
        return response.status(201).json({
          criado: true,
          usuarioID: usuario.id
        });
      })
      .catch(function(erro) {
        return response.status(500).json({
          criado: false,
          erros: erro.message
        });
      });
  }

  // URI de exemplo: http://localhost:3000/api/usuario/1
  async delete(request, response) {
    await Usuario.destroy({
      where: {
        id: request.params.id
      }
    })
      .then(dado => {
        response.status(204).json(dado);
      })
      .catch(function(error) {
        response.status(500).send("Erro interno do servidor");
      });
  }

  // URI de exemplo: http://localhost:3000/api/usuario/1
  async update(request, response) {
    const telefoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const senhaRegEx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    // Em breve buscar dos tipos automaticamente no banco de dados.
    const tipos = ["A", "M", "V"];

    const scheme = yup.object().shape({
      nome: yup.string(),
      telefone: yup.string().matches(telefoneRegExp, "Telefone inválido!"),

      login: yup.string().min(3, "Login deve ter no mínimo 3 caracteres!"),

      email: yup.string().email(),
      senha: yup
        .string()
        .matches(
          senhaRegEx,
          "Senha deve ter no mínimo 8 caracteres, 1 maiúsculo, 1 minúsculo, 1 número e 1 caracter especial!"
        ),
      senhaRepetida: yup
        .string()
        .oneOf([yup.ref("senha"), null], "Senhas devem ser iguais"),

      tipo: yup.mixed().oneOf(tipos, `Tipo deve ser algum destes: ${tipos}.`)
    });

    // Validando com o esquema criado:
    try {
      await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
    } catch (err) {
      return response.status(422).json({
        atualizado: false,
        "nome:": err.name, // => 'ValidationError'
        erros: err.errors
      });
    }

    const { nome, email, telefone, login, senha, tipo } = request.body;

    const atributos = [
      "id",
      "login",
      "nome",
      "email",
      "telefone",
      "tipo",
      "data_expira"
    ];
    const usuario = await Usuario.findAll({
      where: {
        id: request.params.id
      },
      attributes: atributos
    });
    if (usuario[0] == null) {
      response.status(404).json(usuario);
    } else {
      usuario[0].update({
        nome: nome,
        email: email,
        telefone: telefone,
        login: login,
        senha: senha,
        tipo: tipo
      });
      response.status(200).json({
        atualizado: true,
        usuarioID: usuario[0].id
      });
    }
  }

  // URI de exemplo: http://localhost:3000/api/usuario/1
  async get(request, response) {
    const atributos = [
      "id",
      "login",
      "nome",
      "email",
      "telefone",
      "tipo",
      "data_expira"
    ];
    const usuario = await Usuario.findAll({
      where: {
        id: request.params.id
      },
      attributes: atributos
    });
    if (usuario[0] == null) {
      response.status(404).json(usuario);
    } else {
      response.status(200).json(usuario[0]);
    }
  }

  // URI de exemplo: http://localhost:3000/api/usuario?pagina=1&limite=5&atributo=nome&ordem=DESC
  // todos as querys são opicionais
  async getAll(request, response) {
    const atributos = [
      "id",
      "login",
      "nome",
      "email",
      "telefone",
      "tipo",
      "data_expira"
    ];

    Usuario.findAndCountAll()
      .then(dados => {
        const { paginas, ...SortPaginateOptions } = SortPaginate(
          request.query,
          atributos,
          dados.count
        );
        Usuario.findAll({
          attributes: atributos,
          ...SortPaginateOptions
        })
          .then(usuarios => {
            response.status(200).json({
              dados: usuarios,
              quantidade: usuarios.length,
              total: dados.count,
              paginas: paginas,
              offset: SortPaginateOptions.offset
            });
          })
          .catch(error => {
            response.status(500).json({
              titulo: "Erro interno do servidor!",
              error
            });
          });
      })
      .catch(function(error) {
        response.status(500).json({
          titulo: "Erro interno do servidor!",
          error
        });
      });
  }
}

module.exports = UsuarioController;
