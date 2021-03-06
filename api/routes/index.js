const { Router } = require("express");
const router = Router();
const autenticacaoJwt = require("./verificarJwtToken.js");
const { upload } = require("../helpers/files/MulterSettings.js");

// Importar controllers
const TratamentoController = require("../controllers/TratamentoController.js");
const UsuarioController = require("../controllers/UsuarioController.js");
const ConsultaController = require("../controllers/ConsultaController.js");
const PacienteController = require("../controllers/PacienteController.js");
const DatasBloqueadasController = require("../controllers/DatasBloqueadasController.js");
const ArquivoController = require("../controllers/ArquivoController.js");

// Iniciar controllers
const tratamentoController = new TratamentoController();
const usuarioController = new UsuarioController();
const consultaController = new ConsultaController();
const pacienteController = new PacienteController();
const datasBloqueadasController = new DatasBloqueadasController();
const arquivoController = new ArquivoController();

// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const multerUploadConsulta = upload.array("arquivos");

// Tratamento
router.post('/tratamento', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], tratamentoController.create)
router.get('/tratamento/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], tratamentoController.get)
router.put('/tratamento/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], tratamentoController.update)
router.get('/tratamento',[autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], tratamentoController.getAll)
router.delete('/tratamento/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], tratamentoController.delete)

// Usuario
router.post('/signin', usuarioController.signin)
router.get('/me', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], usuarioController.me)
router.post('/usuario', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.create)
router.get('/usuario/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], usuarioController.get)
router.get('/usuario', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], usuarioController.getAll)
router.delete("/usuario/:id", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.delete);
router.put("/usuario/:id", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], usuarioController.update);

// Consulta
router.post('/consulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], consultaController.create)
router.get('/consulta/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], consultaController.get)
router.get('/consulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], consultaController.getAll)
router.put('/consulta/:id', multerUploadConsulta, [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], consultaController.update)
router.post('/primeiraconsulta', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], consultaController.checkPrimeiraConsulta) // Verifica se ?? a primeira consulta de um paciente

// Paciente
router.post('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], pacienteController.create)
router.post('/paciente/pesquisa', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], pacienteController.deepSearch)
router.put('/paciente/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], pacienteController.update)
router.get('/paciente/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], pacienteController.get)
router.get('/paciente', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], pacienteController.getAll)

// Arquivo
router.get('/arquivo/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], arquivoController.download)
router.delete('/arquivo/:id', [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedic], arquivoController.delete)

// BloqueioDataDia
router.post("/bloqueio/semana", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], datasBloqueadasController.createSemana);
router.get("/bloqueio/semana", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], datasBloqueadasController.getAllSemana);
router.put("/bloqueio/semana/:id", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], datasBloqueadasController.updateSemana);
router.delete("/bloqueio/semana", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], datasBloqueadasController.deleteSemana);
router.post("/bloqueio/dia", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], datasBloqueadasController.createDia);
router.get("/bloqueio/dia", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdminOrMedicOrViewer], datasBloqueadasController.getAllDia);
router.put("/bloqueio/dia/:id", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], datasBloqueadasController.updateDia);
router.delete("/bloqueio/dia", [autenticacaoJwt.verificarToken, autenticacaoJwt.isAdmin], datasBloqueadasController.deleteDia);

module.exports = router;
