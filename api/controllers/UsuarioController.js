const yup = require('yup')
const PasswordEncrypt  = require('../helpers/PasswordEncrypt');
const Usuario = require('../models/Usuario');


class UsuarioController {

    async create(request, response) {
        const scheme = yup.object().shape({
            nome: yup.string().required("Nome obrigatório!"),
            email: yup.string().email().required("E-mail obrigatório!"),
            senha: yup.string().required("Senha obrigatório!"),
            tipo: yup.mixed().oneOf(['A', 'M','V'])
        })

        
        // Validando com o esquema criado:
        try {
            await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
        } catch (err) {
            return response.status(422).json({
                'name:': err.name, // => 'ValidationError'
                'message': err.message,
                'errors': err.errors
            })
        }

        const { nome, email, senha, tipo, telefone } = request.body;

        const pe = new PasswordEncrypt()
        const password = await pe.hash(senha)

        const usuario = await Usuario.create({
            nome,
            email,
            senha: password,
            /*login: 'teste',
            telefone: '319989898',
            tipo: 'V'*/
        })

        return response.status(201).json({
            created: true,
            usuarioID: usuario.id
        });
    }

    
    async get(request, response) {
        
    }

    async getAll(request, response) {
        
    }

    
};

module.exports = UsuarioController 