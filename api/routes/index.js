
const { Router } = require('express')
const router = Router()
const autenticacaoJwt = require('./verificarJwtToken.js');

// Importar controllers
const TratamentoController  = require('../controllers/TratamentoController.js');
const UsuarioController  = require('../controllers/UsuarioController.js');
const ConsultaController = require('../controllers/ConsultaController.js');
const PacienteController  = require('../controllers/PacienteController.js');
const { isAdmin } = require('./verificarJwtToken.js');


// Iniciar controllers
const tratamentoController = new TratamentoController();
const usuarioController = new UsuarioController();
const consultaController = new ConsultaController();
const pacienteController = new PacienteController();


// Adicionar rotas
// Tratamento
router.post('/tratamento', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], tratamentoController.create)
router.get('/tratamento/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], tratamentoController.get)
router.get('/tratamento',[autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], tratamentoController.getAll)
router.delete('/tratamento/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], tratamentoController.delete)
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
router.get('/consulta/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], consultaController.get)
router.get('/consulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], consultaController.getAll)
router.put('/consulta/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.update)
router.get('/primeiraconsulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.checkPrimeiraConsulta) // Verifica se é a primeira consulta de um paciente
// Paciente
router.post('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic] , pacienteController.create)
router.put('/paciente/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.update)
router.get('/paciente/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.get)
router.get('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.getAll)

module.exports = router
