
const { Router } = require('express')
const router = Router()
const autenticacaoJwt = require('./verificarJwtToken.js');
const { upload } = require('../helpers/files/MulterSettings.js')

// Importar controllers
const TratamentoController  = require('../controllers/TratamentoController.js');
const UsuarioController  = require('../controllers/UsuarioController.js');
const ConsultaController = require('../controllers/ConsultaController.js');
const PacienteController  = require('../controllers/PacienteController.js');
const ArquivoController = require('../controllers/ArquivoController.js');


// Iniciar controllers
const tratamentoController = new TratamentoController();
const usuarioController = new UsuarioController();
const consultaController = new ConsultaController();
const pacienteController = new PacienteController();
const arquivoController = new ArquivoController();

// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const multerUploadConsulta = upload.array("arquivos");

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
router.put('/consulta/:id', multerUploadConsulta, [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.update)
router.post('/primeiraconsulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.checkPrimeiraConsulta) // Verifica se é a primeira consulta de um paciente
// Paciente
router.post('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic] , pacienteController.create)
router.put('/paciente/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.update)
router.get('/paciente/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.get)
router.get('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.getAll)
// Arquivo
router.get('/arquivo/:id', arquivoController.download)
router.delete('/arquivo/:id', arquivoController.delete)

module.exports = router
