
const { Router } = require('express')
const router = Router()
const autenticacaoJwt = require('./verificarJwtToken.js');

// Importar controllers
const TratamentoController  = require('../controllers/TratamentoController.js');
const UsuarioController  = require('../controllers/UsuarioController.js');
const PacienteController  = require('../controllers/PacienteController.js');


// Iniciar controllers
const tratamentoController = new TratamentoController();
const usuarioController = new UsuarioController();
const pacienteController = new PacienteController();


// Adicionar rotas
// Tratamento
router.post('/tratamento', tratamentoController.create)
router.get('/tratamento/:id', tratamentoController.get)
router.get('/tratamento', tratamentoController.getAll)
// Usuario
router.post('/signin', usuarioController.signin)
router.post('/usuario', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.create)
router.get('/usuario/:id', [autenticacaoJwt.verificarToken], usuarioController.get)
router.get('/usuario', [autenticacaoJwt.verificarToken], usuarioController.getAll)
router.delete('/usuario/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.delete)
router.put('/usuario/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.update)
// Paciente
router.post('/paciente', pacienteController.create)
router.put('/paciente', pacienteController.update)
router.get('/paciente/:id', pacienteController.get)
router.get('/paciente', pacienteController.getAll)

module.exports = router
