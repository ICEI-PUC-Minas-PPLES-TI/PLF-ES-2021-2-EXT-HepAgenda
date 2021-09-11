
const { Router } = require('express')
const router = Router()

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
router.post('/usuario', usuarioController.create)
// Paciente
router.post('/paciente', pacienteController.create)
router.put('/paciente', pacienteController.update)
router.get('/paciente/:id', pacienteController.get)
router.get('/paciente', pacienteController.getAll)

module.exports = router
