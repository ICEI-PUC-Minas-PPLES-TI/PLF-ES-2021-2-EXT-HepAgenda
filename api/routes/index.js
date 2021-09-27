
const { Router } = require('express')
const router = Router()
const autenticacaoJwt = require('./verificarJwtToken.js');

// Importar controllers
const TratamentoController  = require('../controllers/TratamentoController.js');
const UsuarioController  = require('../controllers/UsuarioController.js');
const ConsultaController = require('../controllers/ConsultaController.js');
const PacienteController  = require('../controllers/PacienteController.js');


// Iniciar controllers
const tratamentoController = new TratamentoController();
const usuarioController = new UsuarioController();
const consultaController = new ConsultaController();
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
//router.get('/usuario', [autenticacaoJwt.verificarToken], usuarioController.getAll)
router.get('/usuario', usuarioController.getAll)
router.delete('/usuario/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.delete)
router.put('/usuario/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.update)
// Consulta
router.post('/consulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.create)
router.get('/consulta/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.get)
router.get('/consulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.getAll)
router.put('/consulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.update)
// Paciente
router.post('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic] , pacienteController.create)
router.put('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.update)
router.get('/paciente/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.get)
router.get('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.getAll)

module.exports = router
